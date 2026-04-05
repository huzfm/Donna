export const runtime = "nodejs";

import { sendEmail } from "@/lib/email/resend";
import { createClient } from "@/lib/db/supabase-server";

export async function POST(req: Request) {
      try {
            const { to, subject, body } = await req.json();

            if (!to || !subject || !body) {
                  return Response.json({ error: "Missing to, subject, or body" }, { status: 400 });
            }

            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();
            const metadata = user?.user_metadata;
            const userName = (
                  metadata?.full_name ||
                  metadata?.name ||
                  metadata?.display_name ||
                  ""
            )?.trim();

            await sendEmail(to, subject, body, userName || undefined);

            return Response.json({ success: true });
      } catch (e: unknown) {
            console.error("SEND EMAIL ERROR:", e);
            const message = e instanceof Error ? e.message : "Unknown error";
            return Response.json({ error: message }, { status: 500 });
      }
}
