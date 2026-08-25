import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Offer } from "@/types/offer";

const sanityFetch = vi.hoisted(() => vi.fn());

vi.mock("@/sanity/lib/client", () => ({
  client: { fetch: sanityFetch },
}));

vi.mock("@/components/sections/homepage-density.module.css", () => ({
  default: {
    headerInner: "density-header",
    hero: "density-hero",
    heroContent: "density-hero-content",
    heroTitle: "density-hero-title",
    heroDescription: "density-hero-description",
    howItWorks: "density-how",
    howHeading: "density-how-heading",
    howIntro: "density-how-intro",
    stepsGrid: "density-steps-grid",
    stepConnector: "density-step-connector",
    stepIcon: "density-step-icon",
    stepCard: "density-step-card",
    stepTitle: "density-step-title",
    stepDescription: "density-step-description",
    offerMedia: "density-offer-media",
    offerBody: "density-offer-body",
    offerTitle: "density-offer-title",
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", { href: String(href), ...props }, children),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) =>
    createElement("img", { alt, ...props }),
}));

vi.mock("@/lib/sanity-image", () => ({
  urlFor: () => ({
    width: () => ({
      height: () => ({
        url: () => "https://example.test/offer.jpg",
      }),
    }),
  }),
}));

import { Header } from "@/components/layout/header";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { OfferCard } from "@/components/ui/offer-card";

const densityStyles = readFileSync(
  new URL("./homepage-density.module.css", import.meta.url),
  "utf8"
);
const offer: Offer = {
  _id: "offer-1",
  title: "Konto z premią 500 zł",
  image: {
    asset: {
      _ref: "image-1",
      _type: "reference",
    },
  },
  link: "https://example.test",
  featured: true,
  category: "personal",
  slug: { current: "konto-z-premia" },
};

describe("homepage short-desktop presentation contract", () => {
  beforeEach(() => {
    sanityFetch.mockReset();
  });

  it("activates at desktop width without viewport hacks", () => {
    expect(densityStyles).toContain("@media (min-width: 64rem)");
    expect(densityStyles).not.toContain("max-height");
    expect(densityStyles).not.toMatch(
      /^\s*(transform|scale|zoom|position|inset|clip-path|max-height)\s*:/m
    );
    expect(densityStyles).not.toMatch(/\bdisplay\s*:\s*none\b/);
  });

  it("renders the compact header hook without removing navigation or primary controls", () => {
    const markup = renderToStaticMarkup(
      createElement(Header, { showBlog: true, showLogin: true })
    );

    expect(markup).toContain("data-home-header");
    expect(markup).toContain("density-header");
    expect(markup).toContain('aria-label="Główne menu"');
    expect(markup).toContain("Oferty");
    expect(markup).toContain("Blog");
    expect(markup).toContain("Współpraca");
    expect(markup).toContain("Zaloguj się");
    expect(markup).toContain('aria-label="Otwórz menu"');
    expect(markup).toContain("min-h-[44px]");
    expect(markup).toContain("min-w-[44px]");
  });

  it("keeps the hero heading and explanatory content in the rendered section", async () => {
    sanityFetch.mockResolvedValueOnce(null);

    const markup = renderToStaticMarkup(await HeroSection());

    expect(markup).toContain('data-home-section="hero"');
    expect(markup).toContain("density-hero");
    expect(markup).toContain("Aktualne oferty bankowe z bonusem");
    expect(markup).toContain("Porównaj promocje kont osobistych");
  });

  it("condenses only step descriptions while preserving every step and heading", async () => {
    const steps = [
      {
        _id: "step-1",
        title: "Wybierz ofertę",
        description: "Porównaj dostępne promocje.",
        order: 1,
      },
      {
        _id: "step-2",
        title: "Spełnij warunki",
        description: "Wykonaj wymagane aktywności.",
        order: 2,
      },
      {
        _id: "step-3",
        title: "Odbierz premię",
        description: "Bank wypłaci należną korzyść.",
        order: 3,
      },
    ];
    sanityFetch.mockResolvedValueOnce(steps);

    const markup = renderToStaticMarkup(await HowItWorksSection());

    expect(markup).toContain('data-home-section="how-it-works"');
    expect(markup).toContain("Jak to działa?");
    for (const step of steps) {
      expect(markup).toContain(step.title);
      expect(markup).toContain(step.description);
    }
    expect(markup.match(/density-step-description/g)).toHaveLength(3);
    expect(densityStyles).toMatch(
      /\.stepDescription\s*\{[\s\S]*?-webkit-line-clamp:\s*2;[^}]*\}/
    );
  });

  it("applies compact media only to homepage cards and keeps the primary CTA", () => {
    const homepageMarkup = renderToStaticMarkup(
      createElement(OfferCard, { offer, presentation: "homepage" })
    );
    const defaultMarkup = renderToStaticMarkup(
      createElement(OfferCard, { offer })
    );

    expect(homepageMarkup).toContain("density-offer-media");
    expect(homepageMarkup).toContain("density-offer-body");
    expect(homepageMarkup).toContain("density-offer-title");
    expect(homepageMarkup).toContain("Konto z premią 500 zł");
    expect(homepageMarkup).toContain("Sprawdź ofertę");
    expect(homepageMarkup).toContain("min-h-[44px]");
    expect(defaultMarkup).not.toContain("density-offer-media");
    expect(defaultMarkup).not.toContain("density-offer-body");
    expect(defaultMarkup).not.toContain("density-offer-title");
    expect(densityStyles).toMatch(
      /\.offerMedia\s*\{\s*aspect-ratio:\s*3\s*\/\s*1;\s*\}/
    );
    expect(densityStyles).toMatch(
      /\.offerTitle\s*\{[\s\S]*?display:\s*block;[\s\S]*?-webkit-line-clamp:\s*unset;[\s\S]*?-webkit-box-orient:\s*unset;[\s\S]*?\}/
    );
  });
});
