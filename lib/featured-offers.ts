import type { Offer } from "@/types/offer";

/** Featured slice used by the public carousel / oferty featured block. */
export function getFeaturedOffers(offers: Offer[]): Offer[] {
  return offers.filter((offer) => offer.featured);
}

export function shouldShowFeaturedCarouselControls(
  featuredCount: number
): boolean {
  return featuredCount > 1;
}
