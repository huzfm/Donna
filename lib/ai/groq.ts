import Groq from "groq-sdk";
import { AGENT_TOOLS } from "./agent-tools";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export const SYSTEM_PROMPT = `You are Donna, a smart AI workspace agent. Today: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.

Use your tools whenever the user needs something done. For document questions, always call search_documents first. For diagrams from uploaded files, call get_all_documents first, then output a \`\`\`mermaid block. For Mermaid: use --> arrows, unique node IDs, no parentheses in labels, no reserved words like "end"/"start" as bare IDs.

Be concise, use markdown formatting, cite source file names when referencing documents.`;

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
}

export async function askGroq(
      prompt: string,
      opts?: { systemPrompt?: string; temperature?: number; maxTokens?: number }
) {
      const systemContent = opts?.systemPrompt ?? SYSTEM_PROMPT;
      const temperature = opts?.temperature ?? 0.3;
      const maxTokens = opts?.maxTokens ?? 2048;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            try {
                  const res = await groq.chat.completions.create({
                        model: "llama-3.1-8b-instant",
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

      const allMessages: AgentMessage[] = [{ role: "system", content: systemContent }, ...messages];

      for (let iteration = 0; iteration < maxIterations; iteration++) {
            let res: Groq.Chat.ChatCompletion | undefined;

            for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
                  try {
                        res = await groq.chat.completions.create({
                              model: "meta-llama/llama-4-scout-17b-16e-instruct",
                              temperature: 0.3,
                              max_tokens: 1024,
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
                                    model: "meta-llama/llama-4-scout-17b-16e-instruct",
                                    temperature: 0.3,
                                    max_tokens: 1024,
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
