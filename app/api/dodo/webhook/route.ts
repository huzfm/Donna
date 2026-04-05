export const runtime = "nodejs";

import { dodo } from "@/lib/dodo";
import { adminClient } from "@/lib/supabase-admin";

// Dodo calls this — no user auth required
export async function POST(req: Request) {
  const rawBody = await req.text();

  // Verify webhook signature
  let event: ReturnType<typeof dodo.webhooks.unwrap>;
  try {
    event = dodo.webhooks.unwrap(rawBody, {
      headers: {
        "webhook-id": req.headers.get("webhook-id") ?? "",
        "webhook-signature": req.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": req.headers.get("webhook-timestamp") ?? "",
      },
    });
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

// After
const data = event.data as unknown as Record<string, unknown>;
  const type = event.type as string;

  // Resolve Supabase user by email
  const customer = data.customer as { email?: string } | undefined;
  const email = customer?.email;

  if (!email) {
    return Response.json({ received: true });
  }

  const { data: authData } = await adminClient.auth.admin.listUsers();
  const supabaseUser = authData?.users?.find((u) => u.email === email);

  if (!supabaseUser) {
    console.warn("DODO WEBHOOK: No Supabase user found for email:", email);
    return Response.json({ received: true });
  }

  const userId = supabaseUser.id;
  const subscriptionId = (data.subscription_id as string) ?? null;

  if (type === "subscription.active" || type === "subscription.renewed") {
    await adminClient.from("user_usage").upsert(
      {
        user_id: userId,
        is_subscribed: true,
        dodo_subscription_id: subscriptionId,
        subscription_status: "active",
      },
      { onConflict: "user_id" }
    );
    console.log("DODO: Subscription activated for", email);
  }

  if (type === "subscription.cancelled" || type === "subscription.expired") {
    await adminClient
      .from("user_usage")
      .update({
        is_subscribed: false,
        subscription_status: type === "subscription.cancelled" ? "cancelled" : "expired",
      })
      .eq("user_id", userId);
    console.log("DODO: Subscription ended for", email);
  }

  if (type === "subscription.on_hold") {
    await adminClient
      .from("user_usage")
      .update({ subscription_status: "on_hold" })
      .eq("user_id", userId);
  }

  return Response.json({ received: true });
}
