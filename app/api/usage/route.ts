export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";
import { FREE_LIMITS, isWindowExpired } from "@/lib/payments/limits";

export async function GET() {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();

            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            // Upsert ensures a row always exists for this user
            await adminClient
                  .from("user_usage")
                  .upsert({ user_id: user.id }, { onConflict: "user_id", ignoreDuplicates: true });

            const { data } = await adminClient
                  .from("user_usage")
                  .select(
                        "prompts_used, uploads_used, is_subscribed, dodo_subscription_id, subscription_status, last_reset_at"
                  )
                  .eq("user_id", user.id)
                  .single();

            // Reset counters if 24-hour window has expired
            let usage = data;
            if (usage && isWindowExpired(usage.last_reset_at)) {
                  await adminClient
                        .from("user_usage")
                        .update({
                              prompts_used: 0,
                              uploads_used: 0,
                              last_reset_at: new Date().toISOString(),
                        })
                        .eq("user_id", user.id);
                  usage = { ...usage, prompts_used: 0, uploads_used: 0 };
            }

            return Response.json({
                  usage: usage ?? {
                        prompts_used: 0,
                        uploads_used: 0,
                        is_subscribed: false,
                        dodo_subscription_id: null,
                        subscription_status: null,
                        last_reset_at: null,
                  },
                  limits: FREE_LIMITS,
            });
      } catch (e: unknown) {
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown" },
                  { status: 500 }
            );
      }
}
