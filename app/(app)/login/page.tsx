'use client';

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const appOrigin = useMemo(
    () => process.env.NEXT_PUBLIC_APP_ORIGIN ?? "",
    []
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!appOrigin) {
      setError("Brak NEXT_PUBLIC_APP_ORIGIN w konfiguracji.");
      return;
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      setError("Brak konfiguracji Supabase w zmiennych środowiskowych.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${appOrigin}/auth/callback`,
      },
    });

    if (error) {
      setError("Could not authenticate user. Please check the email address or contact an administrator.");
    } else {
      setMessage("Check your email for a magic link to sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            <span className="text-brand font-bold">Afiliantka</span>{" "}
            <span className="text-slate-400 font-light">Faceless</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
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
                className="border-slate-200 focus:border-brand focus:ring-brand/30 min-h-[44px]"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
            </div>
            <Button
              type="submit"
              className="w-full min-h-[44px] bg-brand hover:bg-brand-dark text-white"
            >
              Send Magic Link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
