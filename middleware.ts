import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const DEFAULT_WEB_HOST = "localhost";
const DEFAULT_APP_HOST = "app.localhost";

export async function middleware(req: NextRequest) {
  // Get host from Host header (more reliable than hostname)
  const hostHeader = req.headers.get("host") || "";
  // Extract hostname without port
  const host = hostHeader.split(":")[0];
  const pathname = req.nextUrl.pathname;

  const WEB_HOST = process.env.WEB_HOST ?? DEFAULT_WEB_HOST;
  const APP_HOST = process.env.APP_HOST ?? DEFAULT_APP_HOST;
  const appOrigin =
    process.env.APP_ORIGIN ?? `${req.nextUrl.protocol}//${APP_HOST}`;

  // Public website host: everything public; app/admin/login/api are sent to APP_HOST
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
      return NextResponse.redirect(`${appOrigin}${pathname}${req.nextUrl.search}`);
    }

    return NextResponse.next();
  }

  // Application host: session required except for explicit public auth routes
  if (host === APP_HOST) {
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

    // Redirect root path to dashboard (if logged in) or login (if not)
    if (pathname === "/") {
      if (session) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    const publicUrls = ["/login", "/auth/callback", "/auth/auth-code-error"];

    if (!session && !publicUrls.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (session && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return res;
  }

  // Other hosts: default passthrough
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
