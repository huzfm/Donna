import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function askGroq(prompt: string) {
  const res = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: "Answer only from context." },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0].message.content;
}