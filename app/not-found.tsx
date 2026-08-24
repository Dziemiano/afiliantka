"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <FileQuestion
          className="h-16 w-16 text-brand mx-auto mb-6"
          aria-hidden="true"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          404
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mb-8">
          Nie znaleziono strony, której szukasz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="min-h-[44px] bg-brand hover:bg-brand-dark">
            <Link href="/">Strona główna</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/oferty">Oferty</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
