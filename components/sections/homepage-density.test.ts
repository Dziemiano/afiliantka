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
    howSurface: "density-how-surface",
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
    fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) =>
    createElement("img", {
      alt,
      "data-fill": fill ? "true" : undefined,
      ...props,
    }),
}));

vi.mock("@/lib/sanity-image", () => ({
  urlFor: () => {
    const chain = {
      width: () => chain,
      height: () => chain,
      fit: () => chain,
      url: () => "https://example.test/offer.jpg",
    };
    return chain;
  },
}));

import { Header } from "@/components/layout/header";
import { HeroSection } from "./hero-section";
import { HowItWorksSection } from "./how-it-works-section";
import { OfferCard } from "@/components/ui/offer-card";

const densityStyles = readFileSync(
  new URL("./homepage-density.module.css", import.meta.url),
  "utf8"
);
const heroSource = readFileSync(
  new URL("./hero-section.tsx", import.meta.url),
  "utf8"
);
const howItWorksSource = readFileSync(
  new URL("./how-it-works-section.tsx", import.meta.url),
  "utf8"
);
const howItWorksStepsSource = readFileSync(
  new URL("./how-it-works-steps.tsx", import.meta.url),
  "utf8"
);
const featuredOffersSource = readFileSync(
  new URL("./featured-offers.tsx", import.meta.url),
  "utf8"
);
const homePageSource = readFileSync(
  new URL("../../app/(website)/page.tsx", import.meta.url),
  "utf8"
);
const headerSource = readFileSync(
  new URL("../layout/header.tsx", import.meta.url),
  "utf8"
);
const offerCardSource = readFileSync(
  new URL("../ui/offer-card.tsx", import.meta.url),
  "utf8"
);

const GLASS_TOKENS = [
  "border-white/45",
  "bg-white/45",
  "shadow-[0_8px_32px_rgba(15,23,42,0.12)]",
  "backdrop-blur-xl",
] as const;
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

const DESKTOP_WIDTH_QUERY = "@media (min-width: 64rem)";
const DOUBLED_SELECTORS = [
  ".headerInner.headerInner",
  ".hero.hero",
  ".heroContent.heroContent",
  ".heroTitle.heroTitle",
  ".heroDescription.heroDescription",
  ".howItWorks.howItWorks",
  ".howSurface.howSurface",
  ".howHeading.howHeading",
  ".howIntro.howIntro",
  ".stepsGrid.stepsGrid",
  ".stepConnector.stepConnector",
  ".stepIcon.stepIcon",
  ".stepCard.stepCard",
  ".stepTitle.stepTitle",
  ".stepDescription.stepDescription",
  ".featured.featured",
  ".featuredHeader.featuredHeader",
  ".allOffersCta.allOffersCta",
  ".allOffersCtaZone.allOffersCtaZone",
  ".offerMedia.offerMedia",
  ".offerBody.offerBody",
  ".offerTitle.offerTitle",
] as const;

function desktopWidthRules(css: string): string {
  const queryIndex = css.indexOf(DESKTOP_WIDTH_QUERY);
  expect(queryIndex, "expected a desktop-width media query").toBeGreaterThanOrEqual(
    0
  );

  const open = css.indexOf("{", queryIndex);
  expect(open, "expected an opening brace after the desktop-width query").toBeGreaterThan(
    queryIndex
  );

  let depth = 0;
  for (let i = open; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) {
        return css.slice(open + 1, i);
      }
    }
  }

  throw new Error("unclosed desktop-width media query");
}

describe("homepage desktop-width density contract", () => {
  beforeEach(() => {
    sanityFetch.mockReset();
  });

  it("activates at desktop width and never at a short-height gate", () => {
    expect(densityStyles).toContain(DESKTOP_WIDTH_QUERY);
    expect(densityStyles).not.toContain(
      "@media (min-width: 64rem) and (max-height: 45rem)"
    );
    expect(densityStyles).not.toContain("max-height: 45rem");
    expect(densityStyles).not.toContain("max-height: 720px");
    expect(densityStyles).not.toContain("max-height");
    expect(densityStyles).not.toMatch(/@media\s*\([^)]*max-height/);
    expect(densityStyles).not.toMatch(
      /^\s*(transform|scale|zoom|position|inset|clip-path|max-height)\s*:/m
    );
    expect(densityStyles).not.toMatch(/\bdisplay\s*:\s*none\b/);
  });

  it("raises doubled selectors and compact spacing only inside the desktop-width query", () => {
    const desktop = desktopWidthRules(densityStyles);
    const outsideDesktop = densityStyles.replace(desktop, "");

    for (const selector of DOUBLED_SELECTORS) {
      expect(desktop, `missing ${selector} in desktop-width rules`).toContain(
        selector
      );
    }

    expect(desktop).toMatch(/\.hero\.hero\s*\{[\s\S]*?padding-block:\s*1rem;/);
    expect(desktop).toMatch(
      /\.heroContent\.heroContent\s*\{[\s\S]*?padding:\s*1rem;/
    );
    expect(desktop).toMatch(
      /\.howItWorks\.howItWorks\s*\{[\s\S]*?padding-block:\s*0\.75rem;/
    );
    expect(desktop).toMatch(
      /\.howSurface\.howSurface\s*\{[\s\S]*?padding:\s*0\.75rem;/
    );
    expect(desktop).toMatch(
      /\.howIntro\.howIntro\s*\{[\s\S]*?margin-bottom:\s*0\.75rem;/
    );
    expect(desktop).toMatch(
      /\.offerMedia\.offerMedia\s*\{\s*height:\s*3\.5rem;\s*max-width:\s*9rem;\s*\}/
    );
    expect(desktop).toMatch(
      /\.offerTitle\.offerTitle\s*\{[\s\S]*?display:\s*block;[\s\S]*?-webkit-line-clamp:\s*unset;[\s\S]*?-webkit-box-orient:\s*unset;[\s\S]*?\}/
    );
    expect(desktop).toMatch(
      /\.stepDescription\.stepDescription\s*\{[\s\S]*?-webkit-line-clamp:\s*2;[^}]*\}/
    );
    expect(desktop).toMatch(
      /\.featured\.featured\s*\{[\s\S]*?padding-block:\s*0\.5rem 1rem;/
    );
    expect(desktop).toMatch(
      /\.allOffersCtaZone\.allOffersCtaZone\s*\{[\s\S]*?padding-top:\s*1rem;/
    );

    expect(outsideDesktop).not.toMatch(/height:\s*3\.5rem/);
    expect(outsideDesktop).not.toMatch(/-webkit-line-clamp:\s*2/);
    expect(outsideDesktop).not.toMatch(/padding-block:\s*1rem/);
  });

  it("aligns above-the-fold glass tokens with offer cards", () => {
    for (const source of [
      headerSource,
      heroSource,
      howItWorksSource,
      howItWorksStepsSource,
      offerCardSource,
    ]) {
      for (const token of GLASS_TOKENS) {
        expect(source, `missing ${token}`).toContain(token);
      }
    }

    expect(howItWorksStepsSource).not.toContain(
      "bg-white border border-slate-100"
    );
  });

  it("keeps compact Tailwind padding that density can beat, not lg:py-28", () => {
    expect(heroSource).toContain("density.hero");
    expect(heroSource).toContain("density.heroContent");
    expect(heroSource).toMatch(/py-14 sm:py-20 lg:py-4/);
    expect(heroSource).not.toContain("lg:py-28");
    expect(heroSource).not.toContain("lg:py-24");
    expect(heroSource).not.toContain("lg:py-16");

    expect(howItWorksSource).toContain("density.howItWorks");
    expect(howItWorksSource).toContain("density.howIntro");
    expect(howItWorksSource).toMatch(/lg:py-3/);
    expect(howItWorksSource).toMatch(/mb-12 lg:mb-3/);
    expect(howItWorksSource).not.toContain("lg:py-28");
    expect(howItWorksSource).not.toContain("lg:py-24");
    expect(howItWorksSource).not.toContain("lg:py-16");

    expect(featuredOffersSource).toContain("density.featured");
    expect(featuredOffersSource).toContain("pb-10");
    expect(featuredOffersSource).not.toContain("lg:py-28");
    expect(homePageSource).toContain('data-home-section="all-offers-cta"');
    expect(homePageSource).toContain("density.allOffersCta");
    expect(homePageSource).toContain("border-t border-white/20");
    expect(headerSource).toContain("density.headerInner");
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
    expect(markup).toContain("border-white/45");
    expect(markup).toContain("bg-white/45");
    expect(markup).toContain("backdrop-blur-xl");
    expect(markup).toContain(
      "shadow-[0_8px_32px_rgba(15,23,42,0.12)]"
    );
  });

  it("keeps the hero heading and explanatory content in the rendered section", async () => {
    sanityFetch.mockResolvedValueOnce(null);

    const markup = renderToStaticMarkup(await HeroSection());

    expect(markup).toContain('data-home-section="hero"');
    expect(markup).toContain("density-hero");
    expect(markup).toContain("density-hero-content");
    expect(markup).toContain("Aktualne oferty bankowe z bonusem");
    expect(markup).toContain("Porównaj promocje kont osobistych");
    expect(markup).toContain("lg:py-4");
    expect(markup).toContain("py-14");
    expect(markup).toContain("sm:py-20");
    expect(markup).not.toContain("lg:py-28");
    expect(markup).toContain("rounded-3xl");
    expect(markup).toContain("border-white/45");
    expect(markup).toContain("bg-white/45");
    expect(markup).toContain("backdrop-blur-xl");
    expect(markup).toContain("text-slate-950");
    expect(markup).toContain("text-slate-700");
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
    expect(markup).toContain("density-how");
    expect(markup).toContain("density-how-surface");
    expect(markup).toContain("density-how-intro");
    expect(markup).toContain("Jak to działa?");
    expect(markup).toContain("Zacznij zarabiać w kilku prostych krokach");
    expect(markup).toContain("lg:py-3");
    expect(markup).toContain("mb-12");
    expect(markup).toContain("lg:mb-3");
    for (const step of steps) {
      expect(markup).toContain(step.title);
      expect(markup).toContain(step.description);
    }
    expect(markup.match(/density-step-description/g)).toHaveLength(3);
    expect(markup.match(/border-white\/45/g)).toHaveLength(4);
    expect(markup.match(/bg-white\/45/g)).toHaveLength(4);
    expect(markup.match(/backdrop-blur-xl/g)).toHaveLength(4);
    expect(markup).toContain("rounded-3xl");
    expect(markup.match(/rounded-2xl/g)).toHaveLength(3);
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
    expect(homepageMarkup).toContain("object-contain");
    expect(homepageMarkup).not.toContain("aspect-[16/10]");
    expect(defaultMarkup).not.toContain("density-offer-media");
    expect(defaultMarkup).not.toContain("density-offer-body");
    expect(defaultMarkup).not.toContain("density-offer-title");
    expect(defaultMarkup).toContain("object-contain");
    expect(defaultMarkup).not.toContain("aspect-[16/10]");
  });
});
