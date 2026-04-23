"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { FeaturedOffers } from "@/components/sections/featured-offers";
import { AllOffersTable } from "@/components/sections/all-offers-table";
import type { Offer } from "@/types/offer";

const CATEGORIES = [
  { key: "all", label: "Wszystkie" },
  { key: "personal", label: "Osobiste" },
  { key: "business", label: "Biznesowe" },
  { key: "credit-cards", label: "Karty kredytowe" },
] as const;

interface OffersFilterProps {
  offers: Offer[];
}

export function OffersFilter({ offers }: OffersFilterProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="overflow-x-auto -mx-2 px-2 sm:mx-0 sm:px-0">
              <div className="flex gap-2 w-fit">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`px-5 py-2.5 min-h-[44px] text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap ${
                      activeCategory === cat.key
                        ? "bg-brand text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Szukaj ofert..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-5 py-2.5 min-h-[44px] text-sm border border-slate-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand w-full sm:w-64 bg-white transition-shadow"
              />
            </div>
          </div>
        </div>
      </div>

      {showFeatured && featuredFiltered.length > 0 && (
        <FeaturedOffers offers={filtered} />
      )}
      <AllOffersTable offers={filtered} />

      {filtered.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg">Brak ofert pasujących do kryteriów.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-3 text-brand hover:text-brand-dark text-sm font-medium transition-colors"
          >
            Wyczyść filtry
          </button>
        </div>
      )}
    </>
  );
}
