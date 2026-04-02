export const runtime = "nodejs";

import { embed } from "@/lib/embed";
import { createClient } from "@/lib/supabase-server";
import { runAgentLoop, AgentMessage } from "@/lib/groq";
import { sendEmail } from "@/lib/email";
import { getRecentEmails } from "@/lib/gmail";

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      question,
      history = [],
    }: { question: string; history?: HistoryMessage[] } = await req.json();

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Build messages array in the OpenAI chat format
    const historyMessages: AgentMessage[] = history
      .filter((m) => m.content?.trim())
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content }));

    const messages: AgentMessage[] = [
      ...historyMessages,
      { role: "user", content: question },
    ];

    // ── Tool executor ────────────────────────────────────────────────────────
    const executeTool = async (
      name: string,
      args: Record<string, unknown>
    ): Promise<string> => {
      // ── search_documents ──────────────────────────────────────────────────
      if (name === "search_documents") {
        const query = String(args.query ?? question);
        try {
          const embeddings = await embed([query]);
          let queryEmbedding = embeddings[0];
          if (Array.isArray(queryEmbedding[0]))
            queryEmbedding = queryEmbedding[0];

          const { data, error } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_count: 12,
            filter_user_id: user.id,
          });

          if (error) return `Search error: ${error.message}`;

          if (!data || data.length === 0) {
            return "No relevant documents found. The user may not have uploaded any files yet.";
          }

          return data
            .map(
              (d: { content: string; file_name: string }) =>
                `[Source: ${d.file_name}]\n${d.content}`
            )
            .join("\n\n---\n\n");
        } catch (err: unknown) {
          return `Search failed: ${err instanceof Error ? err.message : String(err)}`;
        }
      }

      // ── get_all_documents ─────────────────────────────────────────────────
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

          if (!data || data.length === 0) {
            return "No documents found. The user has not uploaded any files yet.";
          }

          return data
            .map(
              (d: { content: string; file_name: string }) =>
                `[Source: ${d.file_name}]\n${d.content}`
            )
            .join("\n\n---\n\n");
        } catch (err: unknown) {
          return `Fetch failed: ${err instanceof Error ? err.message : String(err)}`;
        }
      }

      // ── send_email ────────────────────────────────────────────────────────
      if (name === "send_email") {
        const to = String(args.to ?? "");
        const subject = String(args.subject ?? "Hello");
        const body = String(args.body ?? "");

        if (!to || !to.includes("@")) {
          return "Cannot send email: missing or invalid recipient address.";
        }

        try {
          const metadata = user?.user_metadata;
          const userName = (
            metadata?.full_name ||
            metadata?.name ||
            metadata?.display_name ||
            ""
          )?.trim();
          await sendEmail(to, subject, body, userName || undefined);
          return `Email sent successfully to ${to} with subject "${subject}".`;
        } catch (err: unknown) {
          return `Email send failed: ${err instanceof Error ? err.message : String(err)}`;
        }
      }

      // ── read_gmail ────────────────────────────────────────────────────────
      if (name === "read_gmail") {
        try {
          const { data: settings } = await supabase
            .from("user_settings")
            .select("gmail_user, gmail_app_password")
            .eq("user_id", user.id)
            .single();

          if (!settings?.gmail_user || !settings?.gmail_app_password) {
            return "Gmail is not configured. The user needs to add their Gmail address and App Password in Settings.";
          }

          const emails = await getRecentEmails(
            settings.gmail_user,
            settings.gmail_app_password,
            15
          );

          if (emails.length === 0) {
            return "Inbox is empty — no emails found.";
          }

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
    // ────────────────────────────────────────────────────────────────────────

    const answer = await runAgentLoop(messages, executeTool);

    return Response.json({ answer });
  } catch (e: unknown) {
    console.error("AGENT ERROR:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
