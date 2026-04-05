export const runtime = "nodejs";

import { chunkText } from "@/lib/rag/chunk";
import { embed } from "@/lib/rag/embed";
import { extractText } from "@/lib/rag/extract-text";
import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";
import { FREE_LIMITS, isWindowExpired } from "@/lib/payments/limits";

export async function GET() {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const { data, error } = await supabase
                  .from("documents")
                  .select("file_name, created_at")
                  .eq("user_id", user.id)
                  .order("created_at", { ascending: false });

            if (error) throw new Error(error.message);

            const seen = new Set<string>();
            const files: { file_name: string; uploaded_at: string }[] = [];
            for (const row of data ?? []) {
                  if (!seen.has(row.file_name)) {
                        seen.add(row.file_name);
                        files.push({ file_name: row.file_name, uploaded_at: row.created_at });
                  }
            }

            return Response.json({ files });
      } catch (e: unknown) {
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown error" },
                  { status: 500 }
            );
      }
}

export async function DELETE(req: Request) {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const { file_name } = await req.json();
            if (!file_name || typeof file_name !== "string")
                  return Response.json({ error: "file_name is required" }, { status: 400 });

            const { error, count } = await supabase
                  .from("documents")
                  .delete({ count: "exact" })
                  .eq("user_id", user.id)
                  .eq("file_name", file_name);

            if (error) throw new Error(error.message);
            return Response.json({ success: true, deleted: count });
      } catch (e: unknown) {
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown error" },
                  { status: 500 }
            );
      }
}

export async function POST(req: Request) {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            await adminClient
                  .from("user_usage")
                  .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

            const { data: usageRaw } = await adminClient
                  .from("user_usage")
                  .select("uploads_used, is_subscribed, last_reset_at")
                  .eq("user_id", user.id)
                  .single();

            // Reset counters if 24-hour window has expired
            if (usageRaw && isWindowExpired(usageRaw.last_reset_at)) {
                  await adminClient
                        .from("user_usage")
                        .update({
                              prompts_used: 0,
                              uploads_used: 0,
                              last_reset_at: new Date().toISOString(),
                        })
                        .eq("user_id", user.id);
                  usageRaw.uploads_used = 0;
            }

            const usage = usageRaw;
            if (usage && !usage.is_subscribed && usage.uploads_used >= FREE_LIMITS.uploads)
                  return Response.json({ error: "free_limit_reached" }, { status: 402 });

            const formData = await req.formData();
            const file = formData.get("file") as File;
            if (!file) return Response.json({ error: "No file" }, { status: 400 });

            const buffer = Buffer.from(await file.arrayBuffer());

            let text: string;
            try {
                  text = await extractText(file, buffer);
            } catch {
                  return Response.json({ error: "Unsupported file type" }, { status: 400 });
            }

            text = text.replace(/\s+/g, " ").trim();
            if (!text) return Response.json({ error: "Could not extract text" }, { status: 400 });
            if (text.length > 50000) text = text.slice(0, 50000);

            const chunks = chunkText(text);
            const embeddings = await embed(chunks);
            if (!embeddings || embeddings.length === 0) throw new Error("Embeddings failed");

            const rows = chunks.map((chunk, i) => ({
                  content: chunk,
                  embedding: embeddings[i],
                  file_name: file.name,
                  chunk_index: i,
                  user_id: user.id,
            }));

            const { error } = await supabase.from("documents").insert(rows);
            if (error) throw new Error(error.message);

            await adminClient.rpc("increment_uploads_used", { target_user_id: user.id });

            return Response.json({ success: true, chunks: chunks.length });
      } catch (e: unknown) {
            console.error("UPLOAD ERROR:", e);
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown" },
                  { status: 500 }
            );
      }
}
