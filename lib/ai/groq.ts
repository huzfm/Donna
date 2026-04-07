import Groq from "groq-sdk";
import { AGENT_TOOLS } from "./agent-tools";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

const TODAY = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
});

export const SYSTEM_PROMPT = `You are Donna, a personal AI workspace assistant. Today: ${TODAY}.

The user has uploaded their own documents to their workspace (CVs, resumes, reports, notes, emails, contracts, etc.). You have tools to search and read that content when relevant.

CONVERSATION (no tools):
- Greetings ("hi", "hello", "hey"), thanks, goodbye, and short chitchat → reply briefly, warmly, and helpfully in plain text. Do NOT use tools. Do NOT say "I don't know."
- If the user is just checking in or being friendly, respond like a normal assistant.

WHEN TO USE TOOLS:
- Questions about a specific person, company, project, date, or fact that might be in their files → call search_documents first.
- Diagrams or full-file context → call get_all_documents, then optionally a \`\`\`mermaid block.
- Send email → call send_email. Read inbox → call read_gmail.
- General knowledge (math, coding, how-tos) with no need for their files → answer directly, no tools.

GROUNDING:
- If tools return document text, cite: *(Source: filename)*
- If they asked something that should be in files but search found nothing, say you couldn't find that in their documents and suggest uploading a relevant file — do not reply with a generic "I don't know" for greetings.
- Do not invent facts about their private data; only use what tools return.

STYLE:
- NEVER narrate tool calls ("Calling search_documents…"). Use tools silently.
- Fix obvious typos in user intent. Use markdown when it helps. Be concise.

MERMAID: Use --> arrows, unique node IDs, no parentheses in labels, never use "end" or "start" as bare node IDs.`;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
}

/** Route to a stronger model for complex/long tasks, fast model for simple ones. */
function pickModel(messages: AgentMessage[]): string {
      const last = [...messages].reverse().find((m) => m.role === "user");
      const text = typeof last?.content === "string" ? last.content : "";
      const isComplex =
            text.length > 150 ||
            /summarize|analyz|compar|explain|generat|diagram|list all|overview|write|draft/i.test(text);
      return isComplex ? "llama-3.3-70b-versatile" : "llama-3.1-8b-instant";
}

export async function askGroq(
      prompt: string,
      opts?: {
            systemPrompt?: string;
            temperature?: number;
            maxTokens?: number;
            model?: string;
      }
) {
      const systemContent = opts?.systemPrompt ?? SYSTEM_PROMPT;
      const temperature = opts?.temperature ?? 0.3;
      const maxTokens = opts?.maxTokens ?? 2048;
      const model = opts?.model ?? "llama-3.1-8b-instant";

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                  const res = await groq.chat.completions.create({
                        model,
                        temperature,
                        max_tokens: maxTokens,
                        messages: [
                              { role: "system", content: systemContent },
                              { role: "user", content: prompt },
                        ],
                  });
                  return res.choices[0].message.content;
            } catch (err: unknown) {
                  const isRateLimit =
                        err instanceof Error &&
                        (err.message.includes("rate_limit") || err.message.includes("429"));
                  if (isRateLimit && attempt < MAX_RETRIES) {
                        await sleep(RETRY_DELAY_MS * (attempt + 1));
                        continue;
                  }
                  throw err;
            }
      }
      return null;
}

export type AgentMessage = Groq.Chat.ChatCompletionMessageParam;
export type ToolExecutor = (name: string, args: Record<string, unknown>) => Promise<string>;

export async function runAgentLoop(
      messages: AgentMessage[],
      executeTool: ToolExecutor,
      opts?: { maxIterations?: number; systemPrompt?: string }
): Promise<string> {
      const systemContent = opts?.systemPrompt ?? SYSTEM_PROMPT;
      const maxIterations = opts?.maxIterations ?? 4;
      const model = pickModel(messages);

      const allMessages: AgentMessage[] = [{ role: "system", content: systemContent }, ...messages];

      for (let iteration = 0; iteration < maxIterations; iteration++) {
            let res: Groq.Chat.ChatCompletion | undefined;

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                  try {
                        res = await groq.chat.completions.create({
                              model,
                              temperature: 0.3,
                              max_tokens: 1536,
                              messages: allMessages,
                              tools: AGENT_TOOLS,
                              tool_choice: "auto",
                        });
                        break;
                  } catch (err: unknown) {
                        const errMsg = err instanceof Error ? err.message : String(err);
                        const isToolUseFailed =
                              errMsg.includes("tool_use_failed") ||
                              errMsg.includes("Failed to call a function");
                        if (isToolUseFailed) {
                              const fallback = await groq.chat.completions.create({
                                    model,
                                    temperature: 0.3,
                                    max_tokens: 1536,
                                    messages: allMessages,
                              });
                              return fallback.choices[0].message.content ?? "";
                        }
                        const isRateLimit = errMsg.includes("rate_limit") || errMsg.includes("429");
                        if (isRateLimit && attempt < MAX_RETRIES) {
                              await sleep(RETRY_DELAY_MS * (attempt + 1));
                              continue;
                        }
                        throw err;
                  }
            }

            if (!res) throw new Error("No response from Groq");

            const choice = res.choices[0];
            const msg = choice.message;
            allMessages.push(msg as AgentMessage);

            if (choice.finish_reason === "stop" || !msg.tool_calls || msg.tool_calls.length === 0) {
                  return msg.content ?? "";
            }

            for (const tc of msg.tool_calls) {
                  let args: Record<string, unknown> = {};
                  try {
                        args = JSON.parse(tc.function.arguments || "{}");
                  } catch {
                        args = {};
                  }
                  let result: string;
                  try {
                        result = await executeTool(tc.function.name, args);
                  } catch (err: unknown) {
                        result = `Tool error: ${err instanceof Error ? err.message : String(err)}`;
                  }
                  allMessages.push({
                        role: "tool",
                        tool_call_id: tc.id,
                        content: result,
                  });
            }
      }

      return "I reached the maximum number of reasoning steps. Please try rephrasing your request.";
}
