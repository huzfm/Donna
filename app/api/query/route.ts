export const runtime = "nodejs";

import { embed } from "@/lib/embed";
import { createClient } from "@/lib/supabase-server";
import { askGroq } from "@/lib/groq";
import { sendEmail } from "@/lib/email";
import { getRecentEmails } from "@/lib/gmail";

// Detect "send a mail / email" intent   also catches structured /email shortcuts
const EMAIL_INTENT = /(send\s+(a\s+|an\s+)?e?mail|^send an email to)/i;

// Detect "check inbox / read my emails / summarize emails" intent
const GMAIL_INTENT =
  /(check|read|show|summarize|what.{0,20}in)\s+(my\s+)?(inbox|emails?|mails?|gmail)/i;

// Detect diagram generation intent   fires on any single diagram-related keyword
// so phrases like "give me a diagram for X file" are caught correctly
const DIAGRAM_INTENT =
  /\b(draw|generate|create|make|show|visualize|diagram|flowchart|flow\s+chart|sequence\s+diagram|er\s+diagram|mindmap|mind\s+map|class\s+diagram|gantt|pie\s+chart|graph|chart)\b/i;

// Detect when the user wants a diagram FROM their uploaded/personal files
// e.g. "diagram for my files", "visualize my uploaded data", "chart from huzfm.xlsx"
const FILE_DIAGRAM_INTENT =
  /(diagram|flowchart|chart|visualize|graph).{0,40}(file|upload|document|data|my\s+data|personal|stored|excel|xlsx|csv|pdf|doc)/i;

// Conversation turn shape coming from the frontend
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

    // Accept optional conversation history from the frontend
    const { question, history = [] }: { question: string; history?: HistoryMessage[] } =
      await req.json();

    if (!question) {
      return Response.json({ error: "No question provided" }, { status: 400 });
    }

    // Build a readable history block for the prompt (last 10 turns max to stay within token limits)
    const recentHistory: HistoryMessage[] = history.slice(-10);
    const historyBlock =
      recentHistory.length > 0
        ? recentHistory
            .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
            .join("\n")
        : "";

    // ==============================
    // 📊 DIAGRAM / MERMAID INTENT
    // Run RAG first so diagrams can be built from uploaded file data
    // ==============================
    if (DIAGRAM_INTENT.test(question)) {
      let ragContext = "";
      try {
        if (FILE_DIAGRAM_INTENT.test(question)) {
          // User specifically asked for a diagram from their uploaded files.
          // Bypass embedding similarity   directly fetch ALL their document chunks
          // ordered by file + chunk_index so the content arrives in reading order.
          const { data: allChunks } = await supabase
            .from("documents")
            .select("content, file_name, chunk_index")
            .eq("user_id", user.id)
            .order("file_name", { ascending: true })
            .order("chunk_index", { ascending: true })
            .limit(60); // cap to avoid token overflow

          if (allChunks && allChunks.length > 0) {
            ragContext = allChunks
              .map(
                (d: { content: string; file_name: string }) =>
                  `[Source: ${d.file_name}]\n${d.content}`
              )
              .join("\n\n---\n\n");
          }
        } else {
          // Generic diagram request   use semantic similarity search as before
          const embeddings = await embed([question]);
          let queryEmbedding = embeddings[0];
          if (Array.isArray(queryEmbedding[0])) queryEmbedding = queryEmbedding[0];

          const { data: ragData } = await supabase.rpc("match_documents", {
            query_embedding: queryEmbedding,
            match_count: 12,
            filter_user_id: user.id,
          });

          if (ragData && ragData.length > 0) {
            ragContext = ragData
              .map(
                (d: { content: string; file_name: string }) =>
                  `[Source: ${d.file_name}]\n${d.content}`
              )
              .join("\n\n---\n\n");
          }
        }
      } catch {
        // RAG failure is non-fatal   diagram can still be generated from general knowledge
      }

      const diagramPrompt = `
You are an expert in Mermaid.js diagram syntax (v11). The user wants a diagram.
${ragContext ? `Use the following data extracted from their uploaded file(s) to build the diagram:\n\n${ragContext}\n\n` : ""}
Generate a valid Mermaid.js diagram that accurately represents what the user asked for.

${historyBlock ? `Conversation history:\n${historyBlock}\n` : ""}
User request: ${question}

=== STRICT SYNTAX RULES   violating these WILL cause a parse error ===

1. FLOWCHART ARROWS   use ONLY these in flowchart/graph diagrams:
   ✅  A --> B           (solid arrow)
   ✅  A -- label --> B  (labeled arrow)
   ✅  A -.-> B          (dotted arrow)
   ✅  A ==> B           (thick arrow)
   ❌  A ->> B           FORBIDDEN in flowcharts   this is sequence diagram syntax!
   ❌  A -->> B          FORBIDDEN in flowcharts!

2. RESERVED KEYWORDS   NEVER use these as bare node identifiers:
   ❌  --> end            FORBIDDEN   'end' is a reserved keyword
   ❌  --> start          FORBIDDEN   'start' is a reserved keyword
   ✅  --> EndNode[End]   Use a labelled node instead
   ✅  --> StartNode[Start]

3. NODE LABEL TEXT rules:
   ❌  A[**Bold text**]              FORBIDDEN   markdown bold breaks parsing
   ❌  A[India Refunds (site.com)]  FORBIDDEN   parentheses ( ) inside [ ] labels break parsing!
   ✅  A[India Refunds site.com]    Replace ( ) with spaces or remove them entirely
   ❌  A[Very long label text that goes on and on and on]  Keep labels SHORT (under 40 chars)
   ✅  A[Short descriptive label]   Truncate if needed

4. UNIQUE NODE IDs   every node identifier must be unique in the diagram:
   ❌  A[Description]  ...  A[Description]   FORBIDDEN   duplicate ID 'A' causes silent overwrites
   ✅  DescA[Description of X]  ...  DescB[Description of Y]   Use distinct IDs

5. OUTPUT FORMAT   return ONLY:
\`\`\`mermaid
<your mermaid code here>
\`\`\`
Then 1-2 sentences explaining the diagram. No other text before the code block.

6. SUPPORTED TYPES: flowchart, sequenceDiagram, erDiagram, mindmap, classDiagram, gantt, pie, gitGraph

CORRECT flowchart example:
\`\`\`mermaid
flowchart TD
    StartNode[Start] --> B{Valid?}
    B -- Yes --> C[Dashboard]
    B -- No --> D[Retry]
    C --> EndNode[End]
\`\`\`
`;

      const answer = await askGroq(diagramPrompt);
      return Response.json({ answer });
    }

    // ==============================
    // 📬 GMAIL READ INTENT
    // ==============================
    if (GMAIL_INTENT.test(question)) {
      try {
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

        const emails = await getRecentEmails(settings.gmail_user, settings.gmail_app_password, 15);

        if (emails.length === 0) {
          return Response.json({ answer: "📭 Your inbox appears to be empty." });
        }

        const emailList = emails
          .map((e, i) => `${i + 1}. From: ${e.from}\n   Subject: ${e.subject}\n   Date: ${e.date}`)
          .join("\n\n");

        const prompt = `
You are a smart email assistant. Here are the user's latest Gmail messages:

${emailList}

${historyBlock ? `Conversation so far:\n${historyBlock}\n` : ""}
User question: ${question}

Give a concise, helpful summary:
- 🔴 Any urgent or important emails (meetings, deadlines, action items)
- 📬 Key senders and what they want
- 📋 Quick summary of overall inbox state

Be clear and structured. Use bullet points where helpful.
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
            '❌I couldn\'t understand the email details. Try: "Send a mail to name@email.com with subject Hello and message How are you?"',
        });
      }

      try {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("gmail_user, gmail_app_password")
          .eq("user_id", user.id)
          .single();

        if (!settings?.gmail_user || !settings?.gmail_app_password) {
          return Response.json({
            answer:
              "⚙️ Your Gmail is not configured. Click the Settings icon in the sidebar to add your Gmail and App Password to enable sending emails.",
          });
        }

        await sendEmail(to, subject, body);
        return Response.json({
          answer: `Email sent to **${to}**".`,
        });
      } catch (emailErr: unknown) {
        const msg = emailErr instanceof Error ? emailErr.message : "Unknown error";
        console.error("Email send failed:", msg);
        return Response.json({
          answer: `Failed to send email: ${msg}`,
        });
      }
    }

    // ==============================
    // 🔍 RAG PIPELINE
    // ==============================

    const embeddings = await embed([question]);

    let queryEmbedding = embeddings[0];
    if (Array.isArray(queryEmbedding[0])) {
      queryEmbedding = queryEmbedding[0];
    }

    console.log("EMBEDDING DIM:", queryEmbedding.length);

    // Increased match_count to 12 for more complete answers
    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 12,
      filter_user_id: user.id,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log("MATCHED CHUNKS:", data?.length ?? 0);

    if (!data || data.length === 0) {
      // If no file context, fall back to a general LLM answer using conversation history
      if (recentHistory.length > 0) {
        const generalPrompt = `
You are Donna, a helpful AI assistant. You have no uploaded documents to reference for this question.
Answer based on general knowledge and the conversation history below.

${historyBlock ? `Conversation history:\n${historyBlock}\n` : ""}
User: ${question}

Answer:`;
        const answer = await askGroq(generalPrompt);
        return Response.json({ answer });
      }
      return Response.json({
        answer:
          "I couldn't find anything relevant in your uploaded files. Try uploading a document first.",
      });
    }

    // Build context from matched chunks   include file name as a header
    const context = data
      .map((d: { content: string; file_name: string }) => `[Source: ${d.file_name}]\n${d.content}`)
      .join("\n\n---\n\n");

    const prompt = `You are Donna. Answer the user's question using ONLY the document context below.

RULES:
- Include every relevant fact from the context that directly answers the question.
- Do NOT add information not present in the context.
- Do NOT repeat the same point more than once.
- Do NOT pad with filler phrases like "Great question" or "Certainly".
- Use markdown (bullet points, bold, headers) only when it genuinely improves clarity.
- If the answer is not in the context, say exactly: "I don't have that information in your uploaded files."
- For follow-up questions, use the conversation history to maintain context.

${historyBlock ? `## Conversation History\n${historyBlock}\n` : ""}
## Document Context
${context}

## Question
${question}

## Answer:`;

    const answer = await askGroq(prompt);

    return Response.json({ answer });
  } catch (e: unknown) {
    console.error("QUERY ERROR:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
