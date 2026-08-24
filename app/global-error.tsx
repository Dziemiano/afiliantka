"use client";

import { useEffect } from "react";
import { captureException } from "@/lib/monitoring";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    captureException(error, { digest: error.digest, scope: "global" });
  }, [error]);

  return (
    <html lang="pl">
      <body className="min-h-screen bg-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Błąd krytyczny
          </h1>
          <p className="text-slate-600 text-base mb-8">
            Aplikacja napotkała poważny problem. Odśwież stronę lub spróbuj
            ponownie później.
          </p>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg"
          >
            Spróbuj ponownie
          </button>
        </div>
      </body>
    </html>
  );
}
