import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, subject: string, body: string) {
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    text: body,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
