// components/sections/featured-offers.tsx
"use client";

import { OfferCard } from "@/components/ui/offer-card";
import { Offer } from "@/types/offer";
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FeaturedOffersProps {
  offers: Offer[];
}

export function FeaturedOffers({ offers }: FeaturedOffersProps) {
  const featuredOffers = offers.filter((offer) => offer.featured);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const desktopCarouselRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile carousel functions
  const handleMobileScroll = () => {
    if (!carouselRef.current) return;

    const cardWidth = carouselRef.current.clientWidth;
    const scrollLeft = carouselRef.current.scrollLeft;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setCurrentIndex(newIndex);
  };

  // Desktop carousel functions
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    const firstCardIndex = index * 3;
    const cardNode = cardRefs.current[firstCardIndex];
    if (desktopCarouselRef.current && cardNode) {
      desktopCarouselRef.current.scrollTo({
        left: cardNode.offsetLeft - desktopCarouselRef.current.offsetLeft,
        behavior: "smooth",
      });
    }
  };

  const nextSlide = () => {
    const totalSlides = Math.ceil(featuredOffers.length / 3);
    const newIndex = currentIndex + 1 >= totalSlides ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const totalSlides = Math.ceil(featuredOffers.length / 3);
    const newIndex = currentIndex - 1 < 0 ? totalSlides - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  // FIXED: Move useEffect to top level - always called, but with conditional logic inside
  useEffect(() => {
    // Check if it's mobile and if there are enough offers for autoplay
    const isMobile = window.innerWidth < 768;
    if (!isMobile || featuredOffers.length <= 1) {
      return; // Early return inside useEffect, not conditional calling
    }

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
  }, [currentIndex, featuredOffers.length]); // Always called with proper dependencies

  // Early return after hooks are called
  if (featuredOffers.length === 0) return null;

  const totalSlides = Math.ceil(featuredOffers.length / 3);
  const showDesktopControls = featuredOffers.length > 3;

  return (
    <section className="py-6 px-2 sm:px-8 lg:px-16 xl:px-32 mb-10">
      <div className="flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-[1400px] flex-1">
          <h2 className="text-stone-700 text-base sm:text-lg lg:text-[18px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
            Polecane Oferty
          </h2>

          <div className="relative">
            {/* Mobile Carousel - One Card, Swipe Only */}
            <div className="block sm:hidden">
              <div
                ref={carouselRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
                    className="w-full flex-shrink-0 snap-start px-2"
                    style={{ scrollSnapAlign: "start" }}
                  >
                    <OfferCard
                      offer={offer}
                      className="w-full max-w-sm mx-auto"
                    />
                  </div>
                ))}
              </div>

              {/* Mobile Navigation Dots */}
              {featuredOffers.length > 1 && (
                <div className="flex justify-center gap-2 mt-3">
                  {featuredOffers.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentIndex ? "bg-stone-600" : "bg-stone-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Carousel - 3 Cards Fitting Container Width */}
            <div className="hidden sm:block">
              <div className="flex items-center w-full">
                {showDesktopControls && (
                  <button
                    onClick={prevSlide}
                    className="bg-white hover:bg-stone-50 text-stone-600 rounded-full p-3 shadow-lg transition-all duration-200 z-10 border border-stone-200 mr-4 flex-shrink-0"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <div
                  ref={desktopCarouselRef}
                  className="flex-1 flex overflow-hidden gap-6 pb-6"
                >
                  {featuredOffers.map((offer, idx) => (
                    <div
                      key={offer._id}
                      ref={(el) => {
                        cardRefs.current[idx] = el;
                      }}
                      className="flex-shrink-0"
                      style={{ width: "calc((100% - 2 * 24px) / 3)" }}
                    >
                      <OfferCard offer={offer} className="w-full" />
                    </div>
                  ))}
                </div>
                {showDesktopControls && (
                  <button
                    onClick={nextSlide}
                    className="bg-white hover:bg-stone-50 text-stone-600 rounded-full p-3 shadow-lg transition-all duration-200 z-10 border border-stone-200 ml-4 flex-shrink-0"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Desktop Navigation Dots */}
              {showDesktopControls && (
                <div className="flex justify-center gap-2 mt-3">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentIndex ? "bg-stone-600" : "bg-stone-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
