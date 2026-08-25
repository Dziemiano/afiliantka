import { NextResponse } from "next/server";
import { withRateLimit } from "@/lib/api-rate-limit";
import { getAppOrigin } from "@/lib/hosts";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Rate-limit + validate only. OTP must be started in the browser so the PKCE
 * code_verifier cookie is stored on the same host that later runs /auth/callback.
 */
export async function POST(request: Request) {
  const limited = withRateLimit(request, {
    keyPrefix: "auth:magic-link",
    limit: 5,
    windowMs: 15 * 60_000,
  });
  if (limited) return limited;

  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Nieprawidłowe dane wejściowe." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const requestUrl = new URL(request.url);
  const appOrigin = getAppOrigin(
    requestUrl.protocol,
    requestUrl.port || undefined
  );

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { message: "Podaj prawidłowy adres email." },
      { status: 400 }
    );
  }

  if (!appOrigin) {
    return NextResponse.json(
      {
        message:
          "Brak APP_ORIGIN / NEXT_PUBLIC_APP_ORIGIN w konfiguracji.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    emailRedirectTo: `${appOrigin}/auth/callback`,
  });
}
