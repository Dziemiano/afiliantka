"use client";

import { Offer } from "@/types/offer";
import { CompareOfferCard } from "@/components/ui/compare-offer-card";

interface AllOffersGridProps {
  offers: Offer[];
  compareMode: boolean;
  selectedCompareIds: string[];
  onCompareToggle: (offerId: string) => void;
  maxCompare: number;
}

export function AllOffersTable({
  offers,
  compareMode,
  selectedCompareIds,
  onCompareToggle,
  maxCompare,
}: AllOffersGridProps) {
  if (offers.length === 0) return null;

  return (
    <section className="py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-white text-xl sm:text-2xl font-bold mb-6 drop-shadow-sm">
          Wszystkie oferty
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {offers.map((offer) => (
            <CompareOfferCard
              key={offer._id}
              offer={offer}
              compareMode={compareMode}
              isCompareSelected={selectedCompareIds.includes(offer._id)}
              onCompareToggle={onCompareToggle}
              compareDisabled={
                selectedCompareIds.length >= maxCompare &&
                !selectedCompareIds.includes(offer._id)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
