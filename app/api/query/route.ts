export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";
import { runAgentLoop, AgentMessage } from "@/lib/ai/groq";
import { buildToolExecutor } from "@/lib/ai/tools";
import { FREE_LIMITS, isWindowExpired } from "@/lib/payments/limits";

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
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const { question, history = [] }: { question: string; history?: HistoryMessage[] } =
                  await req.json();
            if (!question) return Response.json({ error: "No question provided" }, { status: 400 });

            await adminClient
                  .from("user_usage")
                  .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

            const { data: usageRaw } = await adminClient
                  .from("user_usage")
                  .select("prompts_used, uploads_used, is_subscribed, last_reset_at")
                  .eq("user_id", user.id)
                  .single();

            // Reset counters if 24-hour window has expired
            if (usageRaw && isWindowExpired(usageRaw.last_reset_at)) {
                  await adminClient
                        .from("user_usage")
                        .update({
                              prompts_used: 0,
                              uploads_used: 0,
                              last_reset_at: new Date().toISOString(),
                        })
                        .eq("user_id", user.id);
                  usageRaw.prompts_used = 0;
                  usageRaw.uploads_used = 0;
            }

            const usage = usageRaw;
            if (usage && !usage.is_subscribed && usage.prompts_used >= FREE_LIMITS.prompts)
                  return Response.json({ error: "free_limit_reached" }, { status: 402 });

            const historyMessages: AgentMessage[] = history
                  .filter((m) => m.content?.trim())
                  .slice(-6)
                  .map((m) => ({ role: m.role, content: m.content }));

            const messages: AgentMessage[] = [
                  ...historyMessages,
                  { role: "user", content: question },
            ];

            const executeTool = buildToolExecutor(user, supabase);
            const answer = await runAgentLoop(messages, executeTool);

            let prompts_used: number | undefined;
            try {
                  const { error: rpcErr } = await adminClient.rpc("increment_prompts_used", {
                        target_user_id: user.id,
                  });
                  if (rpcErr) throw rpcErr;
                  const { data: after } = await adminClient
                        .from("user_usage")
                        .select("prompts_used")
                        .eq("user_id", user.id)
                        .single();
                  if (typeof after?.prompts_used === "number") prompts_used = after.prompts_used;
            } catch (err) {
                  console.error("increment_prompts_used:", err);
            }

            return Response.json({ answer, prompts_used });
      } catch (e: unknown) {
            console.error("AGENT ERROR:", e);
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown error" },
                  { status: 500 }
            );
      }
}
