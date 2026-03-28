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

    const [queryEmbedding] = await embed([question]);

    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 3,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    const context = data?.map((d: { content: string }) => d.content).join("\n") ?? "";

    const prompt = `
Use ONLY the context below.

${context}

Question: ${question}
`;

    const answer = await askGroq(prompt);

    return Response.json({ answer });
  } catch (e: unknown) {
    console.error("QUERY ERROR:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}