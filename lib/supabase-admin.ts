import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Only use server-side.
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
