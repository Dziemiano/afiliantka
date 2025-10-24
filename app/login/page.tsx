'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError("Could not authenticate user. Please check the email address or contact an administrator.");
    } else {
      setMessage('Check your email for a magic link to sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-stone-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-stone-700">
            Afiliantka Faceless
          </CardTitle>
          <CardDescription className="text-stone-600">
            Sign in with a magic link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-stone-300 focus:border-stone-500"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full bg-stone-600 hover:bg-stone-700 text-white"
            >
              Send Magic Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
