import { describe, expect, it } from "vitest";
import {
  getFeaturedOffers,
  shouldShowFeaturedCarouselControls,
} from "@/lib/featured-offers";
import type { Offer } from "@/types/offer";

function offer(partial: Partial<Offer> & Pick<Offer, "_id" | "featured">): Offer {
  return {
    title: partial.title ?? partial._id,
    image: partial.image ?? {
      asset: { _ref: "img", _type: "reference" },
    },
    link: partial.link ?? "https://example.com",
    slug: partial.slug ?? { current: partial._id },
    ...partial,
  };
}

describe("getFeaturedOffers", () => {
  it("returns only featured offers", () => {
    const offers = [
      offer({ _id: "a", featured: true }),
      offer({ _id: "b", featured: false }),
      offer({ _id: "c", featured: true }),
    ];
    expect(getFeaturedOffers(offers).map((o) => o._id)).toEqual(["a", "c"]);
  });

  it("returns empty when none featured", () => {
    expect(getFeaturedOffers([offer({ _id: "a", featured: false })])).toEqual(
      []
    );
  });
});

describe("shouldShowFeaturedCarouselControls", () => {
  it("hides controls for 0–1 items", () => {
    expect(shouldShowFeaturedCarouselControls(0)).toBe(false);
    expect(shouldShowFeaturedCarouselControls(1)).toBe(false);
  });

  it("shows controls for 2+ items", () => {
    expect(shouldShowFeaturedCarouselControls(2)).toBe(true);
  });
});
