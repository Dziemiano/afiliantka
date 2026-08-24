"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { captureException } from "@/lib/monitoring";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest });
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <AlertTriangle
          className="h-16 w-16 text-amber-500 mx-auto mb-6"
          aria-hidden="true"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
          Coś poszło nie tak
        </h1>
        <p className="text-slate-600 text-base mb-8">
          Wystąpił nieoczekiwany błąd. Spróbuj ponownie lub wróć na stronę
          główną.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={reset}
            className="min-h-[44px] bg-brand hover:bg-brand-dark"
          >
            Spróbuj ponownie
          </Button>
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/">Strona główna</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
