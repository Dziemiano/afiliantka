import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { withRateLimit } from "@/lib/api-rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limited = withRateLimit(request, {
    keyPrefix: "newsletter:subscribe",
    limit: 5,
    windowMs: 60_000,
  });
  if (limited) return limited;

  let body: { email?: string; source?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Nieprawidłowe dane wejściowe." },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();
  const source = body.source?.trim() || "website";

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { message: "Podaj prawidłowy adres email." },
      { status: 400 }
    );
  }

  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { message: "Ten adres email jest już zapisany do newslettera." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Zapisano do newslettera." });
}
