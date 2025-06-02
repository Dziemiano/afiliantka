import { OffersGrid } from "./offers-grid";
import { Offer } from "@/types/offer";

interface OffersSectionProps {
  offers: Offer[];
}

export function OffersSection({ offers }: OffersSectionProps) {
  const featuredOffers = offers.filter((offer) => offer.featured);
  const regularOffers = offers.filter((offer) => !offer.featured);

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        {featuredOffers.length > 0 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-stone-700">
                Polecane Oferty
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Najlepsze rozwiązania wybrane specjalnie dla Ciebie
              </p>
            </div>
            <div className="mb-16">
              <OffersGrid offers={featuredOffers} />
            </div>
          </>
        )}

        {regularOffers.length > 0 && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-stone-700">
                {featuredOffers.length > 0
                  ? "Wszystkie Oferty"
                  : "Aktualne Oferty"}
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Wybierz najlepsze rozwiązania dopasowane do Twoich potrzeb
                biznesowych
              </p>
            </div>
            <OffersGrid offers={regularOffers} />
          </>
        )}
      </div>
    </section>
  );
}
