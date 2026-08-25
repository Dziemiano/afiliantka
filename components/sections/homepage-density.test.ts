import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const densityStyles = readFileSync(
  new URL("./homepage-density.module.css", import.meta.url),
  "utf8"
);
const heroSource = readFileSync(
  new URL("./hero-section.tsx", import.meta.url),
  "utf8"
);
const howSource = readFileSync(
  new URL("./how-it-works-section.tsx", import.meta.url),
  "utf8"
);
const featuredSource = readFileSync(
  new URL("./featured-offers.tsx", import.meta.url),
  "utf8"
);
const offerCardSource = readFileSync(
  new URL("../ui/offer-card.tsx", import.meta.url),
  "utf8"
);

describe("homepage short-desktop presentation contract", () => {
  it("targets only short desktop viewports without scaling or clipping sections", () => {
    expect(densityStyles).toContain(
      "@media (min-width: 64rem) and (max-height: 45rem)"
    );
    expect(densityStyles).not.toMatch(/\b(transform|scale|zoom)\s*:/);
    expect(densityStyles).not.toMatch(
      /\.(hero|howItWorks|featured)\s*\{[^}]*overflow:\s*hidden/
    );
  });

  it("keeps stable selectors for the measured homepage sections", () => {
    expect(heroSource).toContain('data-home-section="hero"');
    expect(howSource).toContain('data-home-section="how-it-works"');
    expect(featuredSource).toContain('data-home-section="featured-offers"');
  });

  it("condenses secondary copy and homepage cards while preserving controls", () => {
    expect(densityStyles).toContain("-webkit-line-clamp: 2");
    expect(densityStyles).toContain("aspect-ratio: 3 / 1");
    expect(featuredSource).toContain('presentation="homepage"');
    expect(offerCardSource).toContain('presentation === "homepage"');
    expect(offerCardSource).toContain("min-h-[44px]");
  });
});
