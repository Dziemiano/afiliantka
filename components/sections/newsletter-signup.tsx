"use client";

import { useMemo, useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NewsletterSignupProps {
  source?: "home" | "blog";
  variant?: "inline" | "card";
}

export function NewsletterSignup({
  source = "home",
  variant = "card",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  const apiUrl = useMemo(() => {
    const origin = process.env.NEXT_PUBLIC_APP_ORIGIN;
    if (origin) return `${origin}/api/newsletter/subscribe`;
    if (typeof window !== "undefined") {
      const host = window.location.host.replace(/^app\./, "");
      return `${window.location.protocol}//app.${host}/api/newsletter/subscribe`;
    }
    return "/api/newsletter/subscribe";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = (await res.json()) as { message?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.message || "Nie udało się zapisać do newslettera.");
        return;
      }

      setStatus("success");
      setMessage(data.message || "Dziękujemy za zapis!");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Wystąpił błąd połączenia. Spróbuj ponownie.");
    }
  };

  const form = (
    <form
      onSubmit={handleSubmit}
      className={
        variant === "inline"
          ? "flex flex-col sm:flex-row gap-3 w-full"
          : "flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      }
    >
      <Input
        type="email"
        placeholder="Twój adres email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "loading" || status === "success"}
        className="min-h-[44px] border-slate-200 focus:border-brand focus:ring-brand/30 bg-white"
      />
      <Button
        type="submit"
        disabled={status === "loading" || status === "success"}
        className="min-h-[44px] bg-brand hover:bg-brand-dark text-white font-semibold sm:shrink-0"
      >
        {status === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <>
            <Mail className="h-4 w-4 mr-2" aria-hidden="true" />
            Zapisz się
          </>
        )}
      </Button>
    </form>
  );

  if (variant === "inline") {
    return (
      <div className="w-full">
        {form}
        {message && (
          <p
            className={`mt-2 text-sm ${
              status === "success" ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="py-14 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand/20 text-brand mb-4">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Zapisz się do newslettera
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mb-6">
          Otrzymuj informacje o nowych promocjach bankowych i poradach dotyczących
          ofert.
        </p>
        {form}
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
