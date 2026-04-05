export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";
import { getDodo } from "@/lib/payments/dodo";

export async function POST(req: Request) {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();

            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const { subscription_id } = await req.json();
            if (!subscription_id)
                  return Response.json({ error: "Missing subscription_id" }, { status: 400 });

            // Verify subscription is genuinely active with Dodo
            const subscription = await getDodo().subscriptions.retrieve(subscription_id);

            // Dodo statuses: pending, active, on_hold, cancelled, failed, expired
            if (subscription.status !== "active" && subscription.status !== "pending") {
                  return Response.json({ error: "Subscription not active" }, { status: 402 });
            }

            // Activate in Supabase
            await adminClient.from("user_usage").upsert(
                  {
                        user_id: user.id,
                        is_subscribed: true,
                        dodo_subscription_id: subscription_id,
                        subscription_status: "active",
                  },
                  { onConflict: "user_id" }
            );

            console.log("DODO ACTIVATE: Subscription activated for", user.email);
            return Response.json({ success: true });
      } catch (e: unknown) {
            console.error("DODO ACTIVATE ERROR:", e);
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown" },
                  { status: 500 }
            );
      }
}
