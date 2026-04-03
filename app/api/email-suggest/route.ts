export const runtime = "nodejs";

import { createClient } from "@/lib/supabase-server";
import { askGroq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, to, subject, body, tone } = await req.json();

    //  Improve email body 
    if (type === "improve_body") {
      if (!body?.trim()) {
        return Response.json({ error: "No body provided" }, { status: 400 });
      }

      const toneGuide =
        tone === "professional"
          ? "professional, polished, and formal"
          : tone === "friendly"
            ? "warm, friendly, and conversational"
            : tone === "concise"
              ? "concise, direct, and to the point (as short as possible)"
              : "professional and clear";

      const prompt = `You are a professional email writing assistant. The user wants you to improve their email body.

Tone: ${toneGuide}
${to ? `Recipient: ${to}` : ""}
${subject ? `Subject: ${subject}` : ""}

Original email body:
"""
${body}
"""

Rewrite the email body to be ${toneGuide}. Keep the same core message and intent. Return ONLY the improved email body text, nothing else. No explanations, no quotes, no labels.`;

      const improved = await askGroq(prompt);
      return Response.json({ result: improved?.trim() });
    }

    // ── Suggest subject lines ──────────────────────────────────────────
    if (type === "suggest_subject") {
      if (!body?.trim()) {
        return Response.json({ error: "No body provided" }, { status: 400 });
      }

      const prompt = `You are a professional email writing assistant. Based on this email body, suggest 3 concise, compelling subject lines.

${to ? `Recipient: ${to}` : ""}

Email body:
"""
${body}
"""

Return ONLY a JSON array of 3 subject line strings, nothing else. Example: ["Subject 1", "Subject 2", "Subject 3"]`;

      const raw = await askGroq(prompt);
      try {
        const match = raw?.match(/\[[\s\S]*\]/);
        if (!match) throw new Error("No array found");
        const suggestions = JSON.parse(match[0]);
        return Response.json({ result: suggestions });
      } catch {
        // Fallback: split by newlines
        const lines = raw
          ?.split("\n")
          .map((l: string) => l.replace(/^[\d\.\-\*\"\s]+/, "").trim())
          .filter(Boolean)
          .slice(0, 3);
        return Response.json({ result: lines ?? [] });
      }
    }

    // ── Complete body (ghost text suggestion as user types) ────────────
    if (type === "complete_body") {
      if (!body?.trim() || body.trim().length < 15) {
        return Response.json({ result: "" });
      }

      const prompt = `You are an email autocomplete assistant. Complete the following partial email body naturally. Return ONLY the completion (the text that comes after what's already written), not the full email. If the email seems complete, return an empty string.

${to ? `Recipient: ${to}` : ""}
${subject ? `Subject: ${subject}` : ""}

Partial email body:
"""
${body}
"""

Return ONLY the completion text (a few words to 2 sentences max). If complete, return "".`;

      const completion = await askGroq(prompt);
      const cleaned = completion?.trim().replace(/^["']|["']$/g, "") ?? "";
      return Response.json({ result: cleaned });
    }

    return Response.json({ error: "Invalid type" }, { status: 400 });
  } catch (e: unknown) {
    console.error("EMAIL-SUGGEST ERROR:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
