export async function embed(texts: string[]) {
  const res = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: texts,
      }),
    }
  );

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("HF ERROR:", data);
    throw new Error("Embedding failed: " + JSON.stringify(data));
  }

  return data;
}