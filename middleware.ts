import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getAppOrigin, normalizeHostname } from "@/lib/hosts";

const DEFAULT_WEB_HOST = "localhost";
const DEFAULT_APP_HOST = "app.localhost";

export async function middleware(req: NextRequest) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeHostname(hostHeader);
  const pathname = req.nextUrl.pathname;

  const WEB_HOST = process.env.WEB_HOST?.trim() || DEFAULT_WEB_HOST;
  const APP_HOST = process.env.APP_HOST?.trim() || DEFAULT_APP_HOST;
  const appOrigin = getAppOrigin(
    req.nextUrl.protocol,
    req.nextUrl.port || undefined
  );

  // Public website host: app routes go to APP_ORIGIN (preserves query, e.g. auth code)
  if (host === WEB_HOST) {
    const shouldRedirectToApp =
      pathname === "/login" ||
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/studio") ||
      pathname.startsWith("/files") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/auth");

    if (shouldRedirectToApp) {
      return NextResponse.redirect(
        `${appOrigin}${pathname}${req.nextUrl.search}`
      );
    }

    return NextResponse.next();
  }

  // Application host: session required except for explicit public auth routes
  if (host === APP_HOST) {
    // Do not touch auth cookies on callback — getSession() can break PKCE / OTP exchange
    if (pathname.startsWith("/auth/")) {
      return NextResponse.next();
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-pathname", pathname);

    let res = NextResponse.next({
      request: { headers: requestHeaders },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            req.cookies.set({ name, value, ...options });
            res = NextResponse.next({ request: { headers: req.headers } });
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            req.cookies.set({ name, value: "", ...options });
            res = NextResponse.next({ request: { headers: req.headers } });
            res.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (pathname === "/") {
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const publicUrls = ["/login", "/auth/callback", "/auth/auth-code-error"];
    const isPublicApi =
      pathname === "/api/newsletter/subscribe" ||
      pathname === "/api/analytics/track" ||
      pathname === "/api/auth/magic-link";

    if (!session && !publicUrls.includes(pathname) && !isPublicApi) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (session && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
