export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";
import { getDodo } from "@/lib/payments/dodo";

/**
 * Schedules cancellation at the end of the current billing period.
 * Pro access remains until then; Dodo will emit webhooks when the subscription ends.
 */
export async function POST() {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();

            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const { data: row, error: rowErr } = await adminClient
                  .from("user_usage")
                  .select("dodo_subscription_id, is_subscribed")
                  .eq("user_id", user.id)
                  .maybeSingle();

            if (rowErr) throw new Error(rowErr.message);

            const subId = row?.dodo_subscription_id;
            if (!subId || !row?.is_subscribed) {
                  return Response.json({ error: "No active subscription to cancel." }, { status: 400 });
            }

            const subscription = await getDodo().subscriptions.update(subId, {
                  cancel_at_next_billing_date: true,
                  cancel_reason: "cancelled_by_customer",
            });

            return Response.json({
                  success: true,
                  cancel_at_next_billing_date: subscription.cancel_at_next_billing_date,
                  next_billing_date: subscription.next_billing_date,
            });
      } catch (e: unknown) {
            console.error("DODO CANCEL SUBSCRIPTION:", e);
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown error" },
                  { status: 500 }
            );
      }
}
