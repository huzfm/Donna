import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/auth/callback"];

export async function middleware(request: NextRequest) {
      let supabaseResponse = NextResponse.next({
            request: {
                  headers: request.headers,
            },
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
                              supabaseResponse = NextResponse.next({
                                    request,
                              });
                              cookiesToSet.forEach(({ name, value, options }) =>
                                    supabaseResponse.cookies.set(name, value, options)
                              );
                        },
                  },
            }
      );

      const {
            data: { user },
      } = await supabase.auth.getUser();

      const pathname = request.nextUrl.pathname;
      const isPublicPath = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
      const isApiPath = pathname.startsWith("/api/");

      // 1. Handle CORS Preflight Requests
      if (isApiPath && request.method === "OPTIONS") {
            return new NextResponse(null, {
                  status: 200,
                  headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                        "Access-Control-Allow-Headers":
                              "Content-Type, Authorization, X-Requested-With",
                        "Access-Control-Max-Age": "86400",
                  },
            });
      }

      if (!user && !isPublicPath && !isApiPath) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
      }

      if (user && (pathname === "/login" || pathname === "/signup")) {
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
      }

      if (isApiPath) {
            supabaseResponse.headers.set("Access-Control-Allow-Origin", "*");
            supabaseResponse.headers.set(
                  "Access-Control-Allow-Methods",
                  "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            );
            supabaseResponse.headers.set(
                  "Access-Control-Allow-Headers",
                  "Content-Type, Authorization, X-Requested-With"
            );
      }

      return supabaseResponse;
}

export const config = {
      matcher: [
            "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json|lottie)$).*)",
      ],
};
