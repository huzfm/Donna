export const runtime = "nodejs";

import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return Response.json(
        { error: "Missing to, subject, or body" },
        { status: 400 }
      );
    }

    await sendEmail(to, subject, body);

    return Response.json({ success: true });
  } catch (e: unknown) {
    console.error("SEND EMAIL ERROR:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: message }, { status: 500 });
  }
}
