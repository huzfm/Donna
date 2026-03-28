export const runtime = "nodejs";

import { embed } from "@/lib/embed";
import { supabase } from "@/lib/supabase";
import { askGroq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Get embedding for the question
    const embeddings = await embed([question]);

    // ✅ Handle nested array [[...]] vs flat [...]
    let queryEmbedding = embeddings[0];
    if (Array.isArray(queryEmbedding[0])) {
      queryEmbedding = queryEmbedding[0];
    }

    console.log("EMBEDDING DIM:", queryEmbedding.length); // should be 384

    // Fetch similar chunks from Supabase
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 5,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("MATCHED CHUNKS:", data?.length ?? 0);

    if (!data || data.length === 0) {
      return Response.json({
        answer: "I couldn't find anything relevant in your uploaded files.",
      });
    }

    // Build context from matched chunks
    const context = data
      .map((d: { content: string; file_name: string }) =>
        `[From ${d.file_name}]:\n${d.content}`
      )
      .join("\n\n");

    const prompt = `
You are an AI assistant. Answer the question using ONLY the context below.
If the answer is not in the context, say "I don't know based on the uploaded files."

Context:
${context}

Question: ${question}

Answer:`;

    const answer = await askGroq(prompt);

    return Response.json({ answer });

  } catch (e: unknown) {
    console.error("QUERY ERROR:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}