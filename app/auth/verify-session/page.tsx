'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifySessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Verifying session...');
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const verifySession = async () => {
      const code = searchParams.get('code');
      const invitationToken = searchParams.get('invitation_token');
      const next = searchParams.get('next') ?? '/';

      if (!code) {
        setError('No authentication code provided.');
        router.push('/auth/auth-code-error?error=No authentication code provided.');
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setError(`Error exchanging code: ${exchangeError.message}`);
        router.push(`/auth/auth-code-error?error=${exchangeError.message}`);
        return;
      }

      if (invitationToken) {
        const { data: invitation, error: invitationError } = await supabase
          .from('invitations')
          .select()
          .eq('token', invitationToken)
          .single();

        if (invitationError || !invitation || invitation.used_at) {
          await supabase.auth.signOut();
          setError('Invalid or used invitation.');
          router.push('/auth/auth-code-error?error=Invalid or used invitation.');
          return;
        }

        // Mark invitation as used
        const { error: updateError } = await supabase
          .from('invitations')
          .update({ used_at: new Date().toISOString() })
          .eq('token', invitationToken);

        if (updateError) {
          console.error('Error updating invitation:', updateError);
          setError('Error finalizing invitation.');
          router.push('/auth/auth-code-error?error=Error finalizing invitation.');
          return;
        }
      }

      setMessage('Session verified. Redirecting...');
      router.push(next);
    };

    verifySession();
  }, [router, searchParams, supabase]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-stone-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-stone-700">
            Authentication
          </CardTitle>
          <CardDescription className="text-stone-600">
            {message}
          </CardDescription>
        </CardHeader>
        {error && (
          <CardContent>
            <p className="text-red-500 text-sm mt-2">{error}</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
