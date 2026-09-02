import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sanityFetch = vi.hoisted(() => vi.fn());

vi.mock("@/sanity/lib/client", () => ({
  client: { fetch: sanityFetch },
}));

import { FaqSection } from "./faq-section";

const source = readFileSync(new URL("./faq-section.tsx", import.meta.url), "utf8");

const GLASS_TOKENS = [
  "border-white/45",
  "bg-white/45",
  "shadow-[0_8px_32px_rgba(15,23,42,0.12)]",
  "backdrop-blur-xl",
] as const;

describe("FaqSection glass contract", () => {
  beforeEach(() => {
    sanityFetch.mockReset();
  });

  it("uses glass styling aligned with homepage cards", () => {
    for (const token of GLASS_TOKENS) {
      expect(source, `missing ${token}`).toContain(token);
    }

    expect(source).toContain('data-home-section="faq"');
    expect(source).toContain("rounded-3xl");
    expect(source).toContain("rounded-2xl");
    expect(source).not.toContain("bg-white border border-slate-200");
  });

  it("keeps native details/summary controls with 44px touch targets", async () => {
    sanityFetch.mockResolvedValueOnce([
      {
        _id: "faq-1",
        question: "Czy promocje są aktualne?",
        answer: "Tak, publikujemy bieżące oferty bankowe.",
        order: 1,
      },
    ]);

    const markup = renderToStaticMarkup(await FaqSection());

    expect(markup).toContain("<details");
    expect(markup).toContain("<summary");
    expect(markup).toContain("Czy promocje są aktualne?");
    expect(markup).toContain("Tak, publikujemy bieżące oferty bankowe.");
    expect(markup).toContain("min-h-[44px]");
  });
});
