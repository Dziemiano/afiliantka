import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Offer } from "@/types/offer";

vi.mock("@/components/sections/homepage-density.module.css", () => ({
  default: {
    offerMedia: "density-offer-media",
    offerBody: "density-offer-body",
    offerTitle: "density-offer-title",
  },
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

import { OfferCard } from "@/components/ui/offer-card";

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
  bonusRequirement: "Załóż konto i wpłać 1000 zł w 30 dni",
  description: [
    {
      _type: "block",
      listItem: "bullet",
      children: [{ text: "Do 700 zł premii dla nowych klientów" }],
    },
    {
      _type: "block",
      listItem: "bullet",
      children: [{ text: "0 zł za przelewy BLIK" }],
    },
  ],
  slug: { current: "konto-z-premia" },
};

const compareOfferCardSource = readFileSync(
  new URL("./compare-offer-card.tsx", import.meta.url),
  "utf8"
);
const offerCardSource = readFileSync(
  new URL("./offer-card.tsx", import.meta.url),
  "utf8"
);
const offerCardSkeletonSource = readFileSync(
  new URL("./loading-skeleton.tsx", import.meta.url),
  "utf8"
);

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("public offer card contract", () => {
  it("uses contained logos, glass styling, and bonus bullets on glass cards", () => {
    const glassMarkup = renderToStaticMarkup(
      createElement(OfferCard, { offer, variant: "glass" })
    );

    expect(glassMarkup).toContain("Konto z premią 500 zł");
    expect(glassMarkup).toContain("Sprawdź ofertę");
    expect(glassMarkup).toContain("/oferta/konto-z-premia");
    expect(glassMarkup).toContain("min-h-[44px]");
    expect(glassMarkup).toContain("object-contain");
    expect(glassMarkup).toContain("backdrop-blur-xl");
    expect(glassMarkup).toContain("premii dla nowych klientów");
    expect(glassMarkup).toContain("700 zł");
    expect(glassMarkup).toContain("za przelewy BLIK");
    expect(glassMarkup).not.toContain("aspect-[16/10]");
    expect(glassMarkup).not.toContain("object-cover");
  });

  it("keeps the default solid variant without glassmorphism", () => {
    const solidMarkup = renderToStaticMarkup(createElement(OfferCard, { offer }));

    expect(solidMarkup).toContain("object-contain");
    expect(solidMarkup).toContain("Sprawdź ofertę");
    expect(solidMarkup).toContain("premii dla nowych klientów");
    expect(solidMarkup).not.toContain("backdrop-blur-xl");
    expect(solidMarkup).not.toContain("aspect-[16/10]");
  });

  it("wires CompareOfferCard to the glass variant", () => {
    expect(compareOfferCardSource).toContain('variant="glass"');
  });

  it("renders bonusRequirement bullets and bolds amounts when description is missing", () => {
    const fallbackOffer: Offer = {
      ...offer,
      description: undefined,
    };
    const markup = renderToStaticMarkup(
      createElement(OfferCard, { offer: fallbackOffer, variant: "glass" })
    );

    expect(markup).toContain("<ul");
    expect(markup).toContain("Załóż konto i wpłać");
    expect(markup).toContain("<strong");
    expect(markup).toContain("1000 zł");
    expect(markup).toContain("Sprawdź ofertę");
    expect(markup).toContain("min-h-[44px]");
    expect(markup).toContain("/oferta/konto-z-premia");
  });

  it("keeps contained logos via object-contain and Sanity fit max", () => {
    expect(offerCardSource).toContain('className="object-contain object-center"');
    expect(offerCardSource).toContain('.fit("max")');
    expect(offerCardSource).not.toContain("object-cover");
    expect(offerCardSource).not.toContain("aspect-[16/10]");
  });

  it("uses glass cards on public featured and all-offers lists", () => {
    const featured = readRepoFile("components/sections/featured-offers.tsx");
    const allOffers = readRepoFile("components/sections/all-offers-table.tsx");

    expect(featured).toContain("CompareOfferCard");
    expect(allOffers).toContain("CompareOfferCard");
  });

  it("matches the glass loading skeleton to the public card surface", () => {
    expect(offerCardSkeletonSource).toContain("backdrop-blur-xl");
    expect(offerCardSkeletonSource).toContain("bg-white/45");
    expect(offerCardSkeletonSource).not.toContain("aspect-[16/10]");
  });

  it("fetches description and bonusRequirement for public and dashboard offer cards", () => {
    const sources = [
      readRepoFile("app/(website)/page.tsx"),
      readRepoFile("app/(website)/oferty/page.tsx"),
      readRepoFile("app/(website)/blog/[slug]/page.tsx"),
      readRepoFile("app/(app)/dashboard/offers/page.tsx"),
    ];

    for (const source of sources) {
      expect(source).toMatch(/\bdescription\b/);
      expect(source).toMatch(/\bbonusRequirement\b/);
    }
  });
});
