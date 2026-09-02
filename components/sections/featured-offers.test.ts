import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Offer } from "@/types/offer";

vi.mock("@/components/sections/homepage-density.module.css", () => ({
  default: {
    featured: "density-featured",
    featuredHeader: "density-featured-header",
  },
}));

vi.mock("@/components/ui/carousel", async () => {
  const { createElement: createMockElement } = await import("react");

  const container =
    (slot: string) =>
    ({
      className,
      children,
    }: {
      className?: string;
      children?: React.ReactNode;
    }) =>
      createMockElement(
        "div",
        { className, "data-carousel-slot": slot },
        children
      );

  return {
    Carousel: container("root"),
    CarouselContent: container("content"),
    CarouselItem: container("item"),
    CarouselPrevious: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      createMockElement("button", {
        ...props,
        "data-carousel-slot": "previous",
      }),
    CarouselNext: (props: React.ButtonHTMLAttributes<HTMLButtonElement>) =>
      createMockElement("button", {
        ...props,
        "data-carousel-slot": "next",
      }),
  };
});

vi.mock("@/components/ui/compare-offer-card", async () => {
  const { createElement: createMockElement } = await import("react");

  return {
    CompareOfferCard: ({
      offer,
      presentation,
      className,
    }: {
      offer: Offer;
      presentation?: string;
      className?: string;
    }) =>
      createMockElement(
        "article",
        {
          className,
          "data-offer-id": offer._id,
          "data-presentation": presentation,
        },
        offer.title
      ),
  };
});

import { FeaturedOffers } from "./featured-offers";

function featuredOffer(id: string): Offer {
  return {
    _id: id,
    title: `Oferta ${id}`,
    image: {
      asset: {
        _ref: `image-${id}`,
        _type: "reference",
      },
    },
    link: "https://example.test",
    featured: true,
    slug: { current: id },
  };
}

function renderedClassTokens(markup: string, pattern: RegExp): string[] {
  const match = markup.match(pattern);

  expect(match, `Expected rendered markup to match ${pattern}`).not.toBeNull();

  return match?.[1].trim().split(/\s+/) ?? [];
}

describe("FeaturedOffers layout contract", () => {
  it("shares the all-offers outer width and gutters without narrowing the carousel", () => {
    const markup = renderToStaticMarkup(
      createElement(FeaturedOffers, { offers: [featuredOffer("one")] })
    );
    const section = renderedClassTokens(
      markup,
      /<section[^>]*class="([^"]+)"/
    );
    const outerContainer = renderedClassTokens(
      markup,
      /<section[\s\S]*?<div class="([^"]*\bmax-w-6xl\b[^"]*)"/
    );
    const carousel = renderedClassTokens(
      markup,
      /class="([^"]+)" data-carousel-slot="root"/
    );

    expect(markup).toContain('data-home-section="featured-offers"');
    expect(section).toEqual(
      expect.arrayContaining([
        "px-4",
        "sm:px-6",
        "lg:px-8",
        "pt-4",
        "pb-10",
        "sm:pb-12",
        "lg:pb-4",
        "density-featured",
      ])
    );
    expect(outerContainer).toEqual(
      expect.arrayContaining(["max-w-6xl", "mx-auto"])
    );
    expect(carousel).toContain("w-full");
    expect(carousel).not.toEqual(
      expect.arrayContaining(["px-12", "sm:px-14"])
    );
  });

  it("keeps responsive header controls in flow with 44px touch targets", () => {
    const markup = renderToStaticMarkup(
      createElement(FeaturedOffers, {
        offers: [featuredOffer("one"), featuredOffer("two")],
      })
    );
    const header = renderedClassTokens(
      markup,
      /<div class="([^"]+)"[^>]*><h2/
    );

    expect(header).toEqual(
      expect.arrayContaining([
        "flex",
        "flex-col",
        "items-start",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
        "density-featured-header",
      ])
    );
    expect(markup).toContain('aria-label="Poprzednie oferty"');
    expect(markup).toContain('aria-label="Następne oferty"');
    expect(markup.match(/min-h-\[44px\]/g)).toHaveLength(2);
    expect(markup.match(/min-w-\[44px\]/g)).toHaveLength(2);
    expect(markup.indexOf('data-carousel-slot="previous"')).toBeLessThan(
      markup.indexOf('data-carousel-slot="content"')
    );
  });

  it("keeps every featured offer and gives only these cards homepage presentation", () => {
    const markup = renderToStaticMarkup(
      createElement(FeaturedOffers, {
        offers: [
          featuredOffer("one"),
          { ...featuredOffer("hidden"), featured: false },
          featuredOffer("two"),
        ],
      })
    );

    expect(markup).toContain('data-offer-id="one"');
    expect(markup).toContain('data-offer-id="two"');
    expect(markup).not.toContain('data-offer-id="hidden"');
    expect(markup.match(/data-presentation="homepage"/g)).toHaveLength(2);
    expect(markup).toContain("Polecane oferty");
  });
});
