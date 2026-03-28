import { embed } from "@/lib/embed";
import { supabase } from "@/lib/supabase";
import { askGroq } from "@/lib/groq";

export async function POST(req: Request) {
  const { question } = await req.json();

  const [queryEmbedding] = await embed([question]);

  const { data } = await supabase.rpc("match_documents", {
    query_embedding: queryEmbedding,
    match_count: 3,
  });

  const context = data?.map((d) => d.content).join("\n");

  const prompt = `
Use ONLY the context below.

${context}

Question: ${question}
`;

  const answer = await askGroq(prompt);

  return Response.json({ answer });
}