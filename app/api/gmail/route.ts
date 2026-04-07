// app/api/settings/gmail/route.ts
export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";

// GET — fetch current gmail settings
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await adminClient
    .from("user_settings")
    .select("gmail_user")
    .eq("user_id", user.id)
    .maybeSingle();

  return Response.json({ gmail_user: data?.gmail_user ?? null });
}

// POST — save gmail credentials
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { gmail_user, gmail_app_password } = await req.json();

  if (!gmail_user || !gmail_app_password) {
    return Response.json({ error: "Missing credentials" }, { status: 400 });
  }

  const { error } = await adminClient
    .from("user_settings")
    .upsert(
      { user_id: user.id, gmail_user, gmail_app_password },
      { onConflict: "user_id" }
    );

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}

// DELETE — remove gmail credentials from db
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await adminClient
    .from("user_settings")
    .update({ gmail_user: null, gmail_app_password: null })
    .eq("user_id", user.id);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ success: true });
}