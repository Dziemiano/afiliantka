import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { withRateLimit } from "@/lib/api-rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const appOrigin = process.env.NEXT_PUBLIC_APP_ORIGIN;

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { message: "Podaj prawidłowy adres email." },
      { status: 400 }
    );
  }

  if (!appOrigin) {
    return NextResponse.json(
      { message: "Brak NEXT_PUBLIC_APP_ORIGIN w konfiguracji." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${appOrigin}/auth/callback`,
    },
  });

  if (error) {
    return NextResponse.json(
      {
        message:
          "Nie udało się wysłać linku logowania. Sprawdź adres email lub skontaktuj się z administratorem.",
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: "Sprawdź skrzynkę email — wysłaliśmy link do logowania.",
  });
}
