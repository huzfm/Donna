export const runtime = "nodejs";

import { embed } from "@/lib/embed";
import { createClient } from "@/lib/supabase-server";
import { askGroq } from "@/lib/groq";
import { sendEmail } from "@/lib/email";
import { getRecentEmails } from "@/lib/gmail";

// Detect "send a mail / email" intent
const EMAIL_INTENT = /send\s+(a\s+|an\s+)?e?mail/i;

// Detect "check inbox / read my emails / summarize emails" intent
const GMAIL_INTENT = /(check|read|show|summarize|what.{0,20}in)\s+(my\s+)?(inbox|emails?|mails?|gmail)/i;

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { question } = await req.json();

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // ==============================
    // 📬 GMAIL READ INTENT
    // ==============================
    if (GMAIL_INTENT.test(question)) {
      try {
        // Load this user's Gmail credentials from user_settings
        const { data: settings } = await supabase
          .from("user_settings")
          .select("gmail_user, gmail_app_password")
          .eq("user_id", user.id)
          .single();

        if (!settings?.gmail_user || !settings?.gmail_app_password) {
          return Response.json({
            answer:
              "⚙️ Your Gmail is not configured. Click the Settings (⚙️) icon in the sidebar to add your Gmail and App Password.",
          });
        }

        const emails = await getRecentEmails(
          settings.gmail_user,
          settings.gmail_app_password,
          15
        );

        if (emails.length === 0) {
          return Response.json({ answer: "📭 Your inbox appears to be empty." });
        }

        const emailList = emails
          .map(
            (e, i) =>
              `${i + 1}. From: ${e.from}\n   Subject: ${e.subject}\n   Date: ${e.date}`
          )
          .join("\n\n");

        const prompt = `
You are a smart email assistant. Here are the user's latest Gmail messages:

${emailList}

Give a concise, helpful crux:
- 🔴 Any urgent or important emails (meetings, deadlines, action items)
- 📬 Key senders and what they want
- 📋 Quick summary of overall inbox state

Be brief, use bullet points, and highlight what needs attention first.
`;

        const answer = await askGroq(prompt);
        return Response.json({ answer });
      } catch (gmailErr: unknown) {
        const msg = gmailErr instanceof Error ? gmailErr.message : "Unknown error";
        console.error("GMAIL IMAP ERROR:", msg);
        return Response.json({
          answer: `❌ Couldn't read Gmail: ${msg}`,
        });
      }
    }

    // ==============================
    // 📧 EMAIL SEND INTENT
    // ==============================
    if (EMAIL_INTENT.test(question)) {
      // Use Groq to extract to / subject / body from the user message
      const extractionPrompt = `
You are a helpful assistant. The user wants to send an email.
Extract the email details from their message and return ONLY valid JSON in this exact format:
{
  "to": "recipient@example.com",
  "subject": "Subject line here",
  "body": "Email body here"
}

If any field is missing or unclear, use a sensible default (e.g. subject: "Hello", body: the full message).

User message: "${question}"

JSON:`;

      const raw = await askGroq(extractionPrompt);
      let to: string, subject: string, body: string;

      try {
        // Extract JSON from response (Groq may add text around it)
        const jsonMatch = raw?.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");
        const parsed = JSON.parse(jsonMatch[0]);
        to = parsed.to;
        subject = parsed.subject;
        body = parsed.body;

        if (!to || !subject || !body) throw new Error("Incomplete fields");
      } catch (parseErr) {
        console.error("Email extraction failed:", parseErr, "Raw:", raw);
        return Response.json({
          answer:
            '❌ I couldn\'t understand the email details. Try: "Send a mail to name@email.com with subject Hello and message How are you?"',
        });
      }

      try {
        await sendEmail(to, subject, body);
        return Response.json({
          answer: `✅ Email sent to **${to}** with subject "${subject}".`,
        });
      } catch (emailErr: unknown) {
        const msg = emailErr instanceof Error ? emailErr.message : "Unknown error";
        console.error("Email send failed:", msg);
        return Response.json({
          answer: `❌ Failed to send email: ${msg}`,
        });
      }
    }

    // ==============================
    // 🔍 RAG PIPELINE
    // ==============================

    // Get embedding for the question
    const embeddings = await embed([question]);

    // ✅ Handle nested array [[...]] vs flat [...]
    let queryEmbedding = embeddings[0];
    if (Array.isArray(queryEmbedding[0])) {
      queryEmbedding = queryEmbedding[0];
    }

    console.log("EMBEDDING DIM:", queryEmbedding.length);

    // Fetch similar chunks from Supabase
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 5,
      filter_user_id: user.id,
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