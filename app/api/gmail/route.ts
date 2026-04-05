export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { getRecentEmails } from "@/lib/email/gmail";
import { askGroq } from "@/lib/ai/groq";

export async function GET() {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                  return Response.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Load this user's Gmail credentials from user_settings
            const { data: settings } = await supabase
                  .from("user_settings")
                  .select("gmail_user, gmail_app_password")
                  .eq("user_id", user.id)
                  .single();

            if (!settings?.gmail_user || !settings?.gmail_app_password) {
                  return Response.json(
                        {
                              error: "Gmail not configured. Please add your Gmail credentials in Settings.",
                        },
                        { status: 400 }
                  );
            }

            const emails = await getRecentEmails(
                  settings.gmail_user,
                  settings.gmail_app_password,
                  15
            );

            if (emails.length === 0) {
                  return Response.json({ summary: "Your inbox is empty." });
            }

            const emailList = emails
                  .map(
                        (e, i) =>
                              `${i + 1}. From: ${e.from}\n   Subject: ${e.subject}\n   Date: ${e.date}`
                  )
                  .join("\n\n");

            const prompt = `
You are a smart email assistant. Here are the user's latest Gmail messages:

${emailList}

Give a concise, helpful crux:
-  Any urgent or important emails (meetings, deadlines, action items)
-  Key senders and what they want
-  Quick summary of overall inbox state

Be brief, use bullet points, and highlight what needs attention first.
`;

            const summary = await askGroq(prompt);
            return Response.json({ summary, emails });
      } catch (e: unknown) {
            console.error("GMAIL ERROR:", e);
            const message = e instanceof Error ? e.message : "Unknown error";
            return Response.json({ error: message }, { status: 500 });
      }
}
