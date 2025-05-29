// components/sections/offers-section.tsx
import { OffersGrid } from "./offers-grid";
import { Offer } from "@/types/offer";

interface OffersSectionProps {
  offers: Offer[];
}

export function OffersSection({ offers }: OffersSectionProps) {
  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-stone-700">
            Aktualne Oferty
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Wybierz najlepsze rozwiązania dopasowane do Twoich potrzeb
            biznesowych
          </p>
        </div>

        <OffersGrid offers={offers} />
      </div>
    </section>
  );
}
