"use client";

import { CompareOfferCard } from "@/components/ui/compare-offer-card";
import { Offer } from "@/types/offer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface FeaturedOffersProps {
  offers: Offer[];
  compareMode?: boolean;
  selectedCompareIds?: string[];
  onCompareToggle?: (offerId: string) => void;
  maxCompare?: number;
}

export function FeaturedOffers({
  offers,
  compareMode = false,
  selectedCompareIds = [],
  onCompareToggle,
  maxCompare = 3,
}: FeaturedOffersProps) {
  const featuredOffers = offers.filter((offer) => offer.featured);

  if (featuredOffers.length === 0) return null;

  const cardProps = (offer: Offer) => ({
    offer,
    compareMode,
    isCompareSelected: selectedCompareIds.includes(offer._id),
    onCompareToggle: onCompareToggle ?? (() => {}),
    compareDisabled:
      selectedCompareIds.length >= maxCompare &&
      !selectedCompareIds.includes(offer._id),
  });

  const showControls = featuredOffers.length > 1;

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-slate-800 text-xl sm:text-2xl font-bold mb-6">
          Polecane oferty
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: featuredOffers.length > 1,
          }}
          className="w-full px-12 sm:px-14"
        >
          <CarouselContent className="-ml-3">
            {featuredOffers.map((offer) => (
              <CarouselItem
                key={offer._id}
                className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <CompareOfferCard
                  {...cardProps(offer)}
                  className="w-full max-w-sm mx-auto sm:max-w-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {showControls && (
            <>
              <CarouselPrevious
                aria-label="Poprzednie oferty"
                className="left-0 sm:-left-3 h-11 w-11 min-h-[44px] min-w-[44px] border-slate-200 bg-white text-brand hover:bg-brand-light shadow-md"
              />
              <CarouselNext
                aria-label="Następne oferty"
                className="right-0 sm:-right-3 h-11 w-11 min-h-[44px] min-w-[44px] border-slate-200 bg-white text-brand hover:bg-brand-light shadow-md"
              />
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}
