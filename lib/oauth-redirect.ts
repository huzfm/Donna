/**
 * Target URL after Google → Supabase → your app (PKCE code exchange in /auth/callback).
 * Must appear in Supabase Dashboard → Authentication → URL Configuration → Redirect URLs
 * (e.g. http://localhost:3000/auth/callback and your production URL).
 *
 * Set NEXT_PUBLIC_SITE_URL so redirectTo matches your Site URL exactly in production.
 */
export function getOAuthRedirectUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return `${fromEnv}/auth/callback`;
  if (typeof window !== "undefined") return `${window.location.origin}/auth/callback`;
  return "/auth/callback";
}

/** Pass-through query params for Google’s authorization endpoint (Supabase forwards them). */
export const googleOAuthQueryParams = {
  access_type: "offline",
  prompt: "select_account",
} as const;
