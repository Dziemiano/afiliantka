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
import {
  getFeaturedOffers,
  shouldShowFeaturedCarouselControls,
} from "@/lib/featured-offers";
import density from "@/components/sections/homepage-density.module.css";

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
  const featuredOffers = getFeaturedOffers(offers);

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

  const showControls = shouldShowFeaturedCarouselControls(
    featuredOffers.length
  );

  return (
    <section
      data-home-section="featured-offers"
      className={`py-4 px-4 sm:px-6 lg:px-8 ${density.featured}`}
    >
      <div className="max-w-6xl mx-auto">
        <Carousel
          opts={{
            align: "start",
            loop: featuredOffers.length > 1,
          }}
          className="w-full"
        >
          <div
            className={`mb-6 lg:mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between ${density.featuredHeader}`}
          >
            <h2 className="text-white text-xl font-bold drop-shadow-sm sm:text-2xl">
              Polecane oferty
            </h2>

            {showControls && (
              <div className="flex gap-2">
                <CarouselPrevious
                  aria-label="Poprzednie oferty"
                  className="static h-11 w-11 min-h-[44px] min-w-[44px] translate-y-0 border-slate-200 bg-white text-brand shadow-md hover:bg-brand-light"
                />
                <CarouselNext
                  aria-label="Następne oferty"
                  className="static h-11 w-11 min-h-[44px] min-w-[44px] translate-y-0 border-slate-200 bg-white text-brand shadow-md hover:bg-brand-light"
                />
              </div>
            )}
          </div>

          <CarouselContent className="-ml-3">
            {featuredOffers.map((offer) => (
              <CarouselItem
                key={offer._id}
                className="pl-3 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <CompareOfferCard
                  {...cardProps(offer)}
                  presentation="homepage"
                  className="w-full max-w-sm mx-auto sm:max-w-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
