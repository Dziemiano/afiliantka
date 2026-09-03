import Link from "next/link";
import { FileQuestion, ArrowRight } from "lucide-react";
import { PublicSection } from "@/components/layout/public-section";
import { PublicGlassCard } from "@/components/layout/public-glass-card";

export function PublicNotFoundContent() {
  return (
    <PublicSection maxWidth="3xl" className="py-20 sm:py-28">
      <PublicGlassCard className="p-8 sm:p-12 text-center">
        <FileQuestion
          className="h-16 w-16 text-brand mx-auto mb-6"
          aria-hidden="true"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-950 mb-3">
          404
        </h1>
        <p className="text-slate-700 text-base sm:text-lg mb-8">
          Nie znaleziono strony, której szukasz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-base font-semibold text-white bg-brand hover:bg-brand-dark rounded-xl transition-colors"
          >
            Strona główna
          </Link>
          <Link
            href="/oferty"
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 text-base font-semibold text-slate-800 border border-slate-200 bg-white/80 hover:bg-white rounded-xl transition-colors"
          >
            Oferty
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </PublicGlassCard>
    </PublicSection>
  );
}
