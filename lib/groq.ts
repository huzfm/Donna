import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function askGroq(prompt: string) {
  const res = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    messages: [
      {
        role: "system",
        content:
          "You are Donna, a precise AI assistant. Answer using ONLY the information provided. Be accurate — include every relevant detail but omit anything not directly asked. Never pad, speculate, or repeat yourself.",
      },
      { role: "user", content: prompt },
    ],
  });

  return res.choices[0].message.content;
}
