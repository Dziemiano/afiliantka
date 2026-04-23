"use client";

import { OfferCard } from "@/components/ui/offer-card";
import { Offer } from "@/types/offer";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS_PER_SLIDE = 4;

interface FeaturedOffersProps {
  offers: Offer[];
}

export function FeaturedOffers({ offers }: FeaturedOffersProps) {
  const featuredOffers = offers.filter((offer) => offer.featured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const desktopCarouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMobileScroll = () => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.clientWidth;
    const scrollLeft = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    const firstCardIndex = index * CARDS_PER_SLIDE;
    const cardNode = cardRefs.current[firstCardIndex];
    if (desktopCarouselRef.current && cardNode) {
      desktopCarouselRef.current.scrollTo({
        left: cardNode.offsetLeft - desktopCarouselRef.current.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  const nextSlide = () => {
    const totalSlides = Math.ceil(featuredOffers.length / CARDS_PER_SLIDE);
    const newIndex = currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(featuredOffers.length / CARDS_PER_SLIDE);
    const newIndex = currentIndex - 1 < 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || featuredOffers.length <= 1) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const nextIndex = (currentIndex + 1) % featuredOffers.length;
        const cardWidth = carouselRef.current.clientWidth;
        carouselRef.current.scrollTo({
          left: nextIndex * cardWidth,
          behavior: "smooth",
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, featuredOffers.length]);

  if (featuredOffers.length === 0) return null;

  const totalSlides = Math.ceil(featuredOffers.length / CARDS_PER_SLIDE);
  const showDesktopControls = featuredOffers.length > CARDS_PER_SLIDE;

  return (
    <section className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-slate-800 text-lg sm:text-xl font-bold mb-3">
          Polecane Oferty
        </h2>

        <div className="relative">
          {/* Mobile Carousel */}
          <div className="block sm:hidden">
            <div
              ref={carouselRef}
              className="flex overflow-x-auto snap-x snap-mandatory"
              onScroll={handleMobileScroll}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {featuredOffers.map((offer) => (
                <div
                  key={offer._id}
                  className="w-full flex-shrink-0 snap-start px-1"
                >
                  <OfferCard
                    offer={offer}
                    className="w-full max-w-sm mx-auto"
                  />
                </div>
              ))}
            </div>

            {featuredOffers.length > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                {featuredOffers.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? "bg-brand" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Desktop Carousel -- 4 cards per slide */}
          <div className="hidden sm:block">
            <div className="flex items-center w-full">
              {showDesktopControls && (
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-brand-light text-brand rounded-full p-2 shadow-md transition-all duration-200 z-10 border border-slate-200 mr-2 flex-shrink-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
              )}
              <div
                ref={desktopCarouselRef}
                className="flex-1 flex overflow-hidden gap-3 pb-1"
              >
                {featuredOffers.map((offer, idx) => (
                  <div
                    key={offer._id}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className="flex-shrink-0"
                    style={{ width: "calc((100% - 3 * 12px) / 4)" }}
                  >
                    <OfferCard offer={offer} className="w-full" />
                  </div>
                ))}
              </div>
              {showDesktopControls && (
                <button
                  onClick={nextSlide}
                  className="bg-white hover:bg-brand-light text-brand rounded-full p-2 shadow-md transition-all duration-200 z-10 border border-slate-200 ml-2 flex-shrink-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

            {showDesktopControls && (
              <div className="flex justify-center gap-2 mt-3">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? "bg-brand" : "bg-slate-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
