import type { SupabaseClient, User } from "@supabase/supabase-js";
import { adminClient } from "@/lib/db/supabase-admin";
import { embed } from "@/lib/rag/embed";
import { sendEmail } from "@/lib/email/resend";
import { getRecentEmails } from "@/lib/email/gmail";
import { askGroq } from "@/lib/ai/groq";

export type ToolExecutor = (name: string, args: Record<string, unknown>) => Promise<string>;

type Chunk = { content: string; file_name: string };

/**
 * Fix typos and rewrite into a precise retrieval query.
 * Runs on the fast 8b model since it only needs to clean up short text.
 */
async function rewriteQuery(rawQuery: string): Promise<string> {
      try {
            const result = await askGroq(
                  `Fix any spelling mistakes and rewrite the following as a precise document search query. Reply with ONLY the corrected query, nothing else:\n"${rawQuery}"`,
                  { maxTokens: 60, temperature: 0.1 }
            );
            return result?.trim() || rawQuery;
      } catch {
            return rawQuery;
      }
}

/**
 * Score each chunk 0-10 for relevance and drop those below 5.
 * Keeps at least the top 3 in case all scores are low.
 */
async function rerankChunks(query: string, chunks: Chunk[]): Promise<Chunk[]> {
      if (chunks.length <= 4) return chunks;
      try {
            const list = chunks.map((c, i) => `[${i}] ${c.content.slice(0, 200)}`).join("\n\n");
            const result = await askGroq(
                  `Query: "${query}"\n\nScore each chunk 0-10 for relevance. Reply ONLY with comma-separated scores (e.g. 8,3,9,1):\n\n${list}`,
                  { maxTokens: 80, temperature: 0 }
            );
            const scores = (result ?? "").split(",").map((s) => parseFloat(s.trim()) || 0);
            const filtered = chunks.filter((_, i) => (scores[i] ?? 10) >= 5);
            return filtered.length > 0 ? filtered : chunks.slice(0, 3);
      } catch {
            return chunks;
      }
}

/** Group chunks by source file with clear headers and a grounding instruction. */
function formatContext(chunks: Chunk[]): string {
      const byFile = new Map<string, string[]>();
      for (const chunk of chunks) {
            const arr = byFile.get(chunk.file_name) ?? [];
            arr.push(chunk.content);
            byFile.set(chunk.file_name, arr);
      }
      const body = Array.from(byFile.entries())
            .map(([file, parts]) => `## ${file}\n\n${parts.join("\n\n")}`)
            .join("\n\n---\n\n");
      return `${body}\n\n---\nAnswer using ONLY the above. Cite factual claims as *(Source: filename)*.`;
}

export function buildToolExecutor(user: User, supabase: SupabaseClient): ToolExecutor {
      return async (name: string, args: Record<string, unknown>): Promise<string> => {
            //  search_documents 
            if (name === "search_documents") {
                  const rawQuery = String(args.query ?? "").trim();
                  // Skip expensive RAG when the "query" is clearly conversational — model sometimes still calls the tool for "hi"
                  if (
                        rawQuery.length < 3 ||
                        /^(hi|hello|hey|yo|hiya|sup|thanks|thank you|ok|okay|bye|goodbye|good\s+(morning|afternoon|evening))\.?!*\s*$/i.test(
                              rawQuery
                        )
                  ) {
                        return "No document search was run — the user message looks conversational, not a file lookup. Answer them directly without citing files.";
                  }
                  try {
                        // 1. Rewrite query (typo-fix) AND embed the raw query IN PARALLEL
                        //    We embed the raw query now; if the rewritten form differs we
                        //    use it for full-text search, raw embedding for vector search.
                        const [rewritten, embeddings] = await Promise.all([
                              rewriteQuery(rawQuery),
                              embed([rawQuery]),
                        ]);
                        let queryEmbedding = embeddings[0];
                        if (Array.isArray(queryEmbedding[0])) queryEmbedding = queryEmbedding[0];

                        // 2. Hybrid search (vector + full-text RRF); fallback to pure vector
                        const { data: hybrid, error: hybridErr } = await supabase.rpc("hybrid_search", {
                              query_text: rewritten,
                              query_embedding: queryEmbedding,
                              match_count: 15,
                              filter_user_id: user.id,
                        });

                        let chunks: Chunk[];

                        if (hybridErr) {
                              const { data: fb, error: fbErr } = await supabase.rpc("match_documents", {
                                    query_embedding: queryEmbedding,
                                    match_count: 12,
                                    filter_user_id: user.id,
                              });
                              if (fbErr) return `Search error: ${fbErr.message}`;
                              if (!fb || fb.length === 0) return "No documents found for this query.";
                              chunks = fb as Chunk[];
                        } else {
                              if (!hybrid || hybrid.length === 0) return "No documents found for this query.";
                              chunks = hybrid as Chunk[];
                        }

                        // 3. Only rerank when there are many chunks (avoids extra LLM call for small result sets)
                        const reranked = chunks.length > 8 ? await rerankChunks(rawQuery, chunks) : chunks;

                        // 4. Return structured, headed context
                        return formatContext(reranked);
                  } catch (err: unknown) {
                        return `Search failed: ${err instanceof Error ? err.message : String(err)}`;
                  }
            }

                  //  get_all_documents 
            if (name === "get_all_documents") {
                  try {
                        const { data, error } = await supabase
                              .from("documents")
                              .select("content, file_name, chunk_index")
                              .eq("user_id", user.id)
                              .order("file_name", { ascending: true })
                              .order("chunk_index", { ascending: true })
                              .limit(60);

                        if (error) return `Fetch error: ${error.message}`;
                        if (!data || data.length === 0)
                              return "No documents found. The user has not uploaded any files yet.";

                        return formatContext(data as Chunk[]);
                  } catch (err: unknown) {
                        return `Fetch failed: ${err instanceof Error ? err.message : String(err)}`;
                  }
            }

            //  send_email 
            if (name === "send_email") {
                  const to = String(args.to ?? "");
                  const subject = String(args.subject ?? "Hello");
                  const body = String(args.body ?? "");

                  if (!to || !to.includes("@"))
                        return "Cannot send email: missing or invalid recipient address.";

                  try {
                        const meta = user.user_metadata;
                        const userName = (
                              meta?.full_name ||
                              meta?.name ||
                              meta?.display_name ||
                              ""
                        )?.trim();
                        await sendEmail(to, subject, body, userName || undefined);
                        return `Email sent successfully to ${to} with subject "${subject}".`;
                  } catch (err: unknown) {
                        return `Email send failed: ${err instanceof Error ? err.message : String(err)}`;
                  }
            }

            //  read_gmail 
            if (name === "read_gmail") {
                  try {
                        const { data: settings, error: settingsErr } = await adminClient
                              .from("user_settings")
                              .select("gmail_user, gmail_app_password")
                              .eq("user_id", user.id)
                              .maybeSingle();

                        if (settingsErr)
                              return `Gmail settings could not be loaded: ${settingsErr.message}`;

                        if (!settings?.gmail_user || !settings?.gmail_app_password)
                              return "Gmail is not configured. The user needs to add their Gmail address and App Password in Settings.";

                        const emails = await getRecentEmails(
                              settings.gmail_user,
                              settings.gmail_app_password,
                              15
                        );

                        if (emails.length === 0) return "Inbox is empty — no emails found.";

                        return emails
                              .map(
                                    (e, i) =>
                                          `${i + 1}. From: ${e.from}\n   Subject: ${e.subject}\n   Date: ${e.date}`
                              )
                              .join("\n\n");
                  } catch (err: unknown) {
                        return `Gmail fetch failed: ${err instanceof Error ? err.message : String(err)}`;
                  }
            }

            return `Unknown tool: ${name}`;
      };
}
