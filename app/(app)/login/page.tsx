"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const magicLinkUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_APP_ORIGIN) {
      return `${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/auth/magic-link`;
    }
    if (typeof window !== "undefined") {
      const host = window.location.host.replace(/^app\./, "");
      return `${window.location.protocol}//app.${host}/api/auth/magic-link`;
    }
    return "/api/auth/magic-link";
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      // Rate limit + canonical redirect URL (server). OTP runs in the browser
      // so PKCE code_verifier is stored on this host (app.localhost).
      const res = await fetch(magicLinkUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = (await res.json()) as {
        message?: string;
        emailRedirectTo?: string;
      };

      if (!res.ok) {
        setError(data.message || "Nie udało się wysłać linku logowania.");
        return;
      }

      const emailRedirectTo =
        data.emailRedirectTo ||
        `${process.env.NEXT_PUBLIC_APP_ORIGIN}/auth/callback`;

      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo },
      });

      if (otpError) {
        setError(
          "Nie udało się wysłać linku logowania. Sprawdź adres email lub spróbuj ponownie."
        );
        return;
      }

      setMessage("Sprawdź skrzynkę email — wysłaliśmy link do logowania.");
    } catch {
      setError("Wystąpił błąd połączenia. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl shadow-slate-200/50">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl">
            <span className="text-brand font-bold">Afiliantka</span>{" "}
            <span className="text-slate-400 font-light">Faceless</span>
          </CardTitle>
          <CardDescription className="text-slate-500">
            Zaloguj się za pomocą magic linka
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Adres email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-200 focus:border-brand focus:ring-brand/30 min-h-[44px]"
                autoFocus
                required
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {message && (
                <p className="text-green-600 text-sm mt-2">{message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full min-h-[44px] bg-brand hover:bg-brand-dark text-white font-semibold"
            >
              {loading ? "Wysyłanie..." : "Wyślij link logowania"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
