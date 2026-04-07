export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { adminClient } from "@/lib/db/supabase-admin";

// GET — load Gmail settings for the signed-in user
export async function GET() {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            // Service role + explicit user_id filter — reliable even if RLS on user_settings is wrong
            const { data, error } = await adminClient
                  .from("user_settings")
                  .select("gmail_user, gmail_app_password")
                  .eq("user_id", user.id)
                  .maybeSingle();

            if (error) return Response.json({ error: error.message }, { status: 500 });

            return Response.json({ settings: data ?? null });
      } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Unknown error";
            return Response.json({ error: message }, { status: 500 });
      }
}

// POST — save Gmail credentials
export async function POST(req: Request) {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const body = (await req.json()) as {
                  gmail_user?: unknown;
                  gmail_app_password?: unknown;
            };
            const gmail_user = String(body.gmail_user ?? "").trim();
            const gmail_app_password = String(body.gmail_app_password ?? "")
                  .replace(/\s+/g, "")
                  .trim();

            if (!gmail_user || !gmail_app_password) {
                  return Response.json(
                        { error: "A valid Gmail address and app password are required." },
                        { status: 400 }
                  );
            }

            const { error } = await adminClient.from("user_settings").upsert(
                  {
                        user_id: user.id,
                        gmail_user,
                        gmail_app_password,
                        updated_at: new Date().toISOString(),
                  },
                  { onConflict: "user_id" }
            );

            if (error) throw new Error(error.message);

            return Response.json({ success: true });
      } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Unknown error";
            return Response.json({ error: message }, { status: 500 });
      }
}

// DELETE — remove stored Gmail credentials for the signed-in user
export async function DELETE() {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const { error } = await adminClient.from("user_settings").upsert(
                  {
                        user_id: user.id,
                        gmail_user: null,
                        gmail_app_password: null,
                        updated_at: new Date().toISOString(),
                  },
                  { onConflict: "user_id" }
            );

            if (error) throw new Error(error.message);

            return Response.json({ success: true });
      } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Unknown error";
            return Response.json({ error: message }, { status: 500 });
      }
}
