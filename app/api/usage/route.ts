export const runtime = "nodejs";

import { createClient } from "@/lib/supabase-server";
import { adminClient } from "@/lib/supabase-admin";
import { FREE_LIMITS } from "@/lib/limits";

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
      .select("prompts_used, uploads_used, is_subscribed, dodo_subscription_id, subscription_status")
      .eq("user_id", user.id)
      .single();

    return Response.json({
      usage: data ?? {
        prompts_used: 0,
        uploads_used: 0,
        is_subscribed: false,
        dodo_subscription_id: null,
        subscription_status: null,
      },
      limits: FREE_LIMITS,
    });
  } catch (e: unknown) {
    return Response.json({ error: e instanceof Error ? e.message : "Unknown" }, { status: 500 });
  }
}
