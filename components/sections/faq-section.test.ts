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

describe("FaqSection glass contract", () => {
  beforeEach(() => {
    sanityFetch.mockReset();
  });

  it("uses public glass primitives aligned with homepage cards", () => {
    expect(source).toContain("PublicGlassCard");
    expect(source).toContain("PublicSection");
    expect(source).toContain('data-home-section="faq"');
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
