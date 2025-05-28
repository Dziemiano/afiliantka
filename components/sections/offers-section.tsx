import { OffersGrid } from "./offers-grid";
import { Offer } from "@/types/offer";

interface OffersSectionProps {
  offers: Offer[];
}

export function OffersSection({ offers }: OffersSectionProps) {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Offers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hand-picked deals and exclusive offers curated just for you
          </p>
        </div>

        <OffersGrid offers={offers} />
      </div>
    </section>
  );
}
