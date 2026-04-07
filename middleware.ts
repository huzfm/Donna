import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"];

export async function middleware(request: NextRequest) {
      let supabaseResponse = NextResponse.next({
            request: { headers: request.headers },
      });

      const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                  cookies: {
                        getAll() {
                              return request.cookies.getAll();
                        },
                        setAll(cookiesToSet) {
                              cookiesToSet.forEach(({ name, value, options: _options }) =>
                                    request.cookies.set(name, value)
                              );
                              supabaseResponse = NextResponse.next({ request });
                              cookiesToSet.forEach(({ name, value, options }) =>
                                    supabaseResponse.cookies.set(name, value, options)
                              );
                        },
                  },
            }
      );

      const pathname = request.nextUrl.pathname;
      const isPublicPath = PUBLIC_PATHS.some(
            (p) => pathname === p || pathname.startsWith(p + "/")
      );
      const isApiPath = pathname.startsWith("/api/");

      // CORS preflight — no auth needed
      if (isApiPath && request.method === "OPTIONS") {
            return new NextResponse(null, {
                  status: 200,
                  headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                        "Access-Control-Max-Age": "86400",
                  },
            });
      }

      // Skip Supabase auth check for API routes — each handler does its own.
      if (isApiPath || isPublicPath) {
            if (isApiPath) {
                  supabaseResponse.headers.set("Access-Control-Allow-Origin", "*");
                  supabaseResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
                  supabaseResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
            }
            return supabaseResponse;
      }

      // Post-payment return: Dodo redirects back with ?upgraded=true.
      // Let it through directly — the dashboard handles its own auth check
      // and the /api/dodo/activate endpoint is protected server-side.
      // This avoids the middleware session race that sends users to /login
      // immediately after payment.
      if (request.nextUrl.searchParams.get("upgraded") === "true") {
            return supabaseResponse;
      }

      // For all other protected pages: try to read the session from cookies.
      // getSession() is cookie-only — no network call, no 20s timeouts.
      // Fall back to checking for any Supabase auth cookie so a Supabase
      // blip doesn't lock out users who are clearly logged in.
      let hasSession = false;
      try {
            const { data } = await supabase.auth.getSession();
            hasSession = !!data.session?.user;
      } catch {
            hasSession = request.cookies
                  .getAll()
                  .some((c) => c.name.includes("auth-token") || c.name.startsWith("sb-"));
      }

      // No session → /login with ?next= so we return to the right page after sign-in.
      if (!hasSession) {
            const loginUrl = new URL("/login", request.nextUrl.origin);
            const dest = pathname + request.nextUrl.search;
            if (dest !== "/") loginUrl.searchParams.set("next", dest);
            return NextResponse.redirect(loginUrl);
      }

      return supabaseResponse;
}

export const config = {
      matcher: [
            "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|lottie)$).*)",
      ],
};
