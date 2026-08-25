import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("./featured-offers.tsx", import.meta.url),
  "utf8"
);

function classTokens(pattern: RegExp): string[] {
  const match = source.match(pattern);

  expect(match, `Expected source to match ${pattern}`).not.toBeNull();

  return match?.[1].trim().split(/\s+/) ?? [];
}

describe("FeaturedOffers layout contract", () => {
  it("shares the all-offers outer width and gutters without narrowing the carousel", () => {
    const section = classTokens(
      /className=\{`([^`]*)\$\{density\.featured\}`\}/
    );
    const outerContainer = classTokens(
      /<div className="([^"]*\bmax-w-6xl\b[^"]*)"/
    );
    const carousel = classTokens(/<Carousel[\s\S]*?className="([^"]+)"/);

    expect(section).toEqual(
      expect.arrayContaining(["px-4", "sm:px-6", "lg:px-8"])
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
    const header = classTokens(
      /className=\{`([^`]*\bsm:justify-between\b[^`]*)\$\{density\.featuredHeader\}`\}/
    );
    const previous = classTokens(
      /aria-label="Poprzednie oferty"\s+className="([^"]+)"/
    );
    const next = classTokens(
      /aria-label="Następne oferty"\s+className="([^"]+)"/
    );

    expect(header).toEqual(
      expect.arrayContaining([
        "flex",
        "flex-col",
        "items-start",
        "sm:flex-row",
        "sm:items-center",
        "sm:justify-between",
      ])
    );

    for (const control of [previous, next]) {
      expect(control).toEqual(
        expect.arrayContaining([
          "static",
          "h-11",
          "w-11",
          "min-h-[44px]",
          "min-w-[44px]",
          "translate-y-0",
        ])
      );
    }

    expect(source.indexOf('aria-label="Poprzednie oferty"')).toBeLessThan(
      source.indexOf("<CarouselContent")
    );
  });

  it("exposes stable acceptance selectors and the homepage card presentation", () => {
    expect(source).toContain('data-home-section="featured-offers"');
    expect(source).toContain('presentation="homepage"');
  });
});
