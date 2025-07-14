import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Skip password check for studio and API routes
  if (
    //Password access deactiveted for now
    request.nextUrl.pathname.startsWith("/") ||
    request.nextUrl.pathname.startsWith("/studio") ||
    request.nextUrl.pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  const isAuthenticated =
    request.cookies.get("authenticated")?.value === "true";

  if (!isAuthenticated && request.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthenticated && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
