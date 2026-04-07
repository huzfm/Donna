export const runtime = "nodejs";

import { createClient } from "@/lib/db/supabase-server";
import { getDodo } from "@/lib/payments/dodo";
import { getServerPublicOrigin } from "@/lib/app-url";

export async function POST(req: Request) {
      try {
            const supabase = await createClient();
            const {
                  data: { user },
            } = await supabase.auth.getUser();

            if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

            const origin = getServerPublicOrigin(req);

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
