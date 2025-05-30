// components/sections/featured-offers.tsx
import { OfferCard } from "@/components/ui/offer-card";
import { Offer } from "@/types/offer";

interface FeaturedOffersProps {
  offers: Offer[];
}

export function FeaturedOffers({ offers }: FeaturedOffersProps) {
  const featuredOffers = offers.filter((offer) => offer.featured);

  if (featuredOffers.length === 0) return null;

  return (
    <section className="py-4">
      <div className="px-40 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="text-center mb-8">
            <h2 className="text-stone-700 text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Polecane Oferty
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-3 px-4 pb-3">
            {featuredOffers.map((offer) => (
              <div key={offer._id} className="flex-shrink-0 w-60">
                <OfferCard offer={offer} variant="featured" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
