export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { getDodo } from "@/lib/payments/dodo";

export async function POST(req: Request) {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();

            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            // Use explicit APP_URL env var if set, otherwise fall back to the request origin
            // but force http for localhost (localhost doesn't support https)
            let origin = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
            if (origin.includes("localhost")) {
                  origin = origin.replace("https://", "http://");
            }

            const session = await getDodo().checkoutSessions.create({
                  product_cart: [
                        {
                              product_id: process.env.DODO_PRODUCT_ID!,
                              quantity: 1,
                        },
                  ],
                  customer: {
                        email: user.email!,
                        name: user.user_metadata?.full_name ?? user.email!,
                  },
                  // Pre-fill India so Dodo applies the correct GST rate and shows INR
                  billing_address: { country: "IN" },
                  billing_currency: "INR",
                  return_url: `${origin}/dashboard?upgraded=true`,
            });

            return Response.json({ checkout_url: session.checkout_url });
      } catch (e: unknown) {
            console.error("DODO CHECKOUT ERROR:", e);
            return Response.json(
                  { error: e instanceof Error ? e.message : "Unknown" },
                  { status: 500 }
            );
      }
}
