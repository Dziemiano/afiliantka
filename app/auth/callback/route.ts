import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const invitationToken = searchParams.get('invitation_token')
  const next = searchParams.get('next') ?? '/panel'

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=No code provided`)
  }

  const cookieStore = await cookies()
  const response = NextResponse.redirect(`${origin}${next}`); // Create response early

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
          response.cookies.set(name, '', options);
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error.message}`)
  }

  if (invitationToken) {
    const { data: invitation, error: invitationError } = await supabase
      .from('invitations')
      .select()
      .eq('token', invitationToken)
      .single()

    if (invitationError || !invitation || invitation.used_at) {
      await supabase.auth.signOut()
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=Invalid or used invitation`)
    }

    // Mark invitation as used
    await supabase
      .from('invitations')
      .update({ used_at: new Date().toISOString() })
      .eq('token', invitationToken)
  }

  return response
}

