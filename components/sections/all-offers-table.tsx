"use client";

import { Offer } from "@/types/offer";
import { OfferCard } from "@/components/ui/offer-card";

interface AllOffersGridProps {
  offers: Offer[];
}

export function AllOffersTable({ offers }: AllOffersGridProps) {
  if (offers.length === 0) return null;

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-slate-800 text-lg sm:text-xl font-bold mb-3">
          Wszystkie Oferty
        </h2>

        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white divide-y divide-slate-100">
          {offers.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
