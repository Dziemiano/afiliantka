import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { getAppOrigin, isSafeAppPath } from "@/lib/hosts";

export async function GET(request: Request) {
  const { searchParams, origin, port, protocol } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const invitationToken = searchParams.get("invitation_token");
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = isSafeAppPath(nextParam) ? nextParam : "/dashboard";

  const appOrigin = getAppOrigin(protocol, port || undefined) || origin;

  if (!code && !(tokenHash && type)) {
    return NextResponse.redirect(
      `${appOrigin}/auth/auth-code-error?error=No%20auth%20token%20provided`
    );
  }

  const cookieStore = await cookies();
  const response = NextResponse.redirect(`${appOrigin}${next}`);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          response.cookies.set(name, value, options);
        },
        remove: (name: string, options: CookieOptions) => {
          response.cookies.set(name, "", options);
        },
      },
    }
  );

  // Prefer token_hash (no PKCE). Falls back to ?code= for default Supabase links.
  const { error } = tokenHash && type
    ? await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    : await supabase.auth.exchangeCodeForSession(code!);

  if (error) {
    return NextResponse.redirect(
      `${appOrigin}/auth/auth-code-error?error=${encodeURIComponent(error.message)}`
    );
  }

  if (invitationToken) {
    const { data: invitation, error: invitationError } = await supabase
      .from("invitations")
      .select()
      .eq("token", invitationToken)
      .single();

    if (invitationError || !invitation || invitation.used_at) {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        `${appOrigin}/auth/auth-code-error?error=Invalid%20or%20used%20invitation`
      );
    }

    await supabase
      .from("invitations")
      .update({ used_at: new Date().toISOString() })
      .eq("token", invitationToken);
  }

  return response;
}
