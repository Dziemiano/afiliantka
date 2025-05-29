// components/sections/offers-grid.tsx
import { OfferCard } from "@/components/ui/offer-card";
import { Offer } from "@/types/offer";

interface OffersGridProps {
  offers: Offer[];
}

export function OffersGrid({ offers }: OffersGridProps) {
  if (offers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-stone-500 text-lg">Obecnie brak dostępnych ofert.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {offers.map((offer, index) => (
        <OfferCard key={offer._id} offer={offer} featured={index === 0} />
      ))}
    </div>
  );
}
