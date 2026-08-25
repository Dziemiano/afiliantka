"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, Scale } from "lucide-react";
import { FeaturedOffers } from "@/components/sections/featured-offers";
import { AllOffersTable } from "@/components/sections/all-offers-table";
import {
  OfferComparison,
  OfferCompareBar,
} from "@/components/sections/offer-comparison";
import type { Offer } from "@/types/offer";

const MAX_COMPARE = 3;

const CATEGORIES = [
  { key: "all", label: "Wszystkie" },
  { key: "personal", label: "Osobiste" },
  { key: "business", label: "Biznesowe" },
  { key: "credit-cards", label: "Karty kredytowe" },
] as const;

interface OffersFilterProps {
  offers: Offer[];
  showPageHeader?: boolean;
}

export function OffersFilter({ offers, showPageHeader = false }: OffersFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = offers;

    if (activeCategory !== "all") {
      result = result.filter((o) => o.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((o) => o.title.toLowerCase().includes(q));
    }

    return result;
  }, [offers, activeCategory, searchQuery]);

  const featuredFiltered = filtered.filter((o) => o.featured);
  const showFeatured = activeCategory === "all" && !searchQuery.trim();

  const handleCompareToggle = useCallback((offerId: string) => {
    setSelectedCompareIds((prev) => {
      if (prev.includes(offerId)) {
        return prev.filter((id) => id !== offerId);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, offerId];
    });
  }, []);

  const handleCompareModeToggle = () => {
    setCompareMode((prev) => {
      if (prev) {
        setSelectedCompareIds([]);
        setCompareOpen(false);
      }
      return !prev;
    });
  };

  const compareProps = {
    compareMode,
    selectedCompareIds,
    onCompareToggle: handleCompareToggle,
    maxCompare: MAX_COMPARE,
  };

  return (
    <>
      {showPageHeader && (
        <section className="bg-gradient-to-br from-brand-light via-white to-teal-50 py-10 sm:py-14 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Oferty bankowe
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
              Przeglądaj sprawdzone promocje bankowe — konta osobiste, firmowe i
              karty kredytowe.
            </p>
          </div>
        </section>
      )}

      <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
                <div className="flex gap-2 w-fit">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-5 py-2.5 min-h-[44px] text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                        activeCategory === cat.key
                          ? "bg-brand text-white shadow-md shadow-brand/20"
                          : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Szukaj ofert..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-5 py-2.5 min-h-[44px] text-sm border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand focus:shadow-md w-full sm:w-72 bg-white transition-shadow"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCompareModeToggle}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                    compareMode
                      ? "bg-brand text-white shadow-md"
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <Scale className="h-4 w-4" aria-hidden="true" />
                  {compareMode ? "Anuluj porównanie" : "Porównaj oferty"}
                </button>
              </div>
            </div>

            {compareMode && (
              <p className="text-sm text-slate-500">
                Wybierz od 2 do {MAX_COMPARE} ofert, aby je porównać obok siebie.
              </p>
            )}
          </div>
        </div>
      </div>

      {showFeatured && featuredFiltered.length > 0 && (
        <FeaturedOffers offers={filtered} {...compareProps} />
      )}
      <AllOffersTable offers={filtered} {...compareProps} />

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500 px-4">
          <p className="text-lg">Brak ofert pasujących do kryteriów.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-3 text-brand hover:text-brand-dark text-sm font-medium transition-colors min-h-[44px] px-4"
          >
            Wyczyść filtry
          </button>
        </div>
      )}

      <OfferCompareBar
        count={selectedCompareIds.length}
        maxCount={MAX_COMPARE}
        onCompare={() => setCompareOpen(true)}
        onClear={() => setSelectedCompareIds([])}
      />

      <OfferComparison
        offers={offers}
        selectedIds={selectedCompareIds}
        onRemove={handleCompareToggle}
        onClose={() => setCompareOpen(false)}
        open={compareOpen}
      />

      {selectedCompareIds.length > 0 && (
        <div className="h-20 sm:h-16" aria-hidden="true" />
      )}
    </>
  );
}
