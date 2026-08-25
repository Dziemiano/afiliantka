import { describe, expect, it } from "vitest";
import {
  emphasizeOfferAmounts,
  getOfferHighlights,
} from "@/lib/offer-highlights";

function block(
  text: string,
  listItem?: "bullet" | "number"
): Record<string, unknown> {
  return {
    _type: "block",
    ...(listItem ? { listItem } : {}),
    children: [{ _type: "span", text }],
  };
}

describe("emphasizeOfferAmounts", () => {
  it("bolds złoty amounts and percentages", () => {
    expect(
      emphasizeOfferAmounts("Do 700 zł premii i 5,25% na koncie")
    ).toEqual([
      { text: "Do ", bold: false },
      { text: "700 zł", bold: true },
      { text: " premii i ", bold: false },
      { text: "5,25%", bold: true },
      { text: " na koncie", bold: false },
    ]);
  });

  it("keeps plain copy unchanged when there is no amount", () => {
    expect(emphasizeOfferAmounts("Załóż konto i wpłać środki")).toEqual([
      { text: "Załóż konto i wpłać środki", bold: false },
    ]);
  });

  it("bolds spaced thousands and amounts at the edges", () => {
    expect(emphasizeOfferAmounts("200 000 zł na start i 8%")).toEqual([
      { text: "200 000 zł", bold: true },
      { text: " na start i ", bold: false },
      { text: "8%", bold: true },
    ]);
  });
});

describe("getOfferHighlights", () => {
  it("prefers bullet list items from Portable Text", () => {
    const highlights = getOfferHighlights({
      description: [
        block("Długi wstęp do oferty bez konkretnej kwoty."),
        block("Do 700 zł premii dla nowych klientów", "bullet"),
        block("300 zł za konto dla dziecka", "bullet"),
        block("0 zł za przelewy BLIK", "bullet"),
      ],
    });

    expect(highlights).toEqual([
      "Do 700 zł premii dla nowych klientów",
      "300 zł za konto dla dziecka",
      "0 zł za przelewy BLIK",
    ]);
  });

  it("keeps list highlights instead of replacing them with bonusRequirement", () => {
    const highlights = getOfferHighlights({
      bonusRequirement: "Załóż konto i wpłać 1000 zł w 30 dni",
      description: [
        block("Do 700 zł premii dla nowych klientów", "bullet"),
        block("0 zł za przelewy BLIK", "bullet"),
      ],
    });

    expect(highlights).toEqual([
      "Do 700 zł premii dla nowych klientów",
      "0 zł za przelewy BLIK",
    ]);
  });

  it("uses bonusRequirement when the description has no highlights", () => {
    const highlights = getOfferHighlights({
      bonusRequirement: "Załóż konto i wpłać 1000 zł w 30 dni",
    });

    expect(highlights).toEqual(["Załóż konto i wpłać 1000 zł w 30 dni"]);
  });

  it("falls back to short paragraphs that mention a bonus", () => {
    const highlights = getOfferHighlights({
      description: [
        block("Do 700 zł premii dla nowych klientów"),
        block("5,25% do 200 000 zł na koncie oszczędnościowym"),
      ],
    });

    expect(highlights).toEqual([
      "Do 700 zł premii dla nowych klientów",
      "5,25% do 200 000 zł na koncie oszczędnościowym",
    ]);
  });

  it("caps the number of highlights", () => {
    const highlights = getOfferHighlights(
      {
        description: [
          block("A 100 zł", "bullet"),
          block("B 200 zł", "bullet"),
          block("C 300 zł", "bullet"),
          block("D 400 zł", "bullet"),
          block("E 500 zł", "bullet"),
        ],
      },
      3
    );

    expect(highlights).toEqual(["A 100 zł", "B 200 zł", "C 300 zł"]);
  });

  it("strips HTML and drops numbered-step junk from lists", () => {
    const highlights = getOfferHighlights({
      description: [
        block("1.", "number"),
        block("Kliknij w link.<br>", "number"),
        block("Co zyskujesz?", "bullet"),
        block("Do 700 zł premii dla nowych klientów", "number"),
        block("Na podstawie wniosku powinno zostać założone konto.\n5.", "number"),
      ],
    });

    expect(highlights).toEqual([
      "Do 700 zł premii dla nowych klientów",
      "Na podstawie wniosku powinno zostać założone konto.",
    ]);
  });

  it("returns an empty list when there is no description or bonus", () => {
    expect(getOfferHighlights({})).toEqual([]);
  });

  it("defaults to four highlights when maxItems is omitted", () => {
    const highlights = getOfferHighlights({
      description: [
        block("A 100 zł", "bullet"),
        block("B 200 zł", "bullet"),
        block("C 300 zł", "bullet"),
        block("D 400 zł", "bullet"),
        block("E 500 zł", "bullet"),
      ],
    });

    expect(highlights).toEqual([
      "A 100 zł",
      "B 200 zł",
      "C 300 zł",
      "D 400 zł",
    ]);
  });

  it("returns no highlights when the limit is zero", () => {
    expect(
      getOfferHighlights(
        {
          bonusRequirement: "Załóż konto i wpłać 1000 zł w 30 dni",
          description: [block("Do 700 zł premii", "bullet")],
        },
        0
      )
    ).toEqual([]);
  });

  it("uses bonusRequirement when description has only unstructured copy", () => {
    const highlights = getOfferHighlights({
      bonusRequirement: "Załóż konto i wpłać 1000 zł w 30 dni",
      description: [
        block(
          "Oferta jest skierowana do nowych klientów indywidualnych, którzy chcą otworzyć konto i korzystać z bankowości internetowej na co dzień."
        ),
      ],
    });

    expect(highlights).toEqual(["Załóż konto i wpłać 1000 zł w 30 dni"]);
  });

  it("returns an empty list for unstructured paragraphs without a bonus", () => {
    expect(
      getOfferHighlights({
        description: [
          block(
            "Oferta jest skierowana do nowych klientów indywidualnych, którzy chcą otworzyć konto i korzystać z bankowości internetowej na co dzień."
          ),
        ],
      })
    ).toEqual([]);
  });

  it("keeps paragraph highlights instead of replacing them with bonusRequirement", () => {
    const highlights = getOfferHighlights({
      bonusRequirement: "Załóż konto i wpłać 1000 zł w 30 dni",
      description: [block("Do 700 zł premii dla nowych klientów")],
    });

    expect(highlights).toEqual(["Do 700 zł premii dla nowych klientów"]);
  });

  it("ignores blank bonusRequirement and duplicate highlight wording", () => {
    expect(
      getOfferHighlights({
        bonusRequirement: "   ",
        description: [
          block("Do 700 zł premii dla nowych klientów", "bullet"),
          block("Do 700 zł premii dla nowych klientów", "bullet"),
        ],
      })
    ).toEqual(["Do 700 zł premii dla nowych klientów"]);
  });

  it("truncates long highlights with an ellipsis", () => {
    const longBonus = `${"Wpłać środki i utrzymaj saldo przez wymagany okres promocji. ".repeat(4)}Koniec.`;
    const [highlight] = getOfferHighlights({
      bonusRequirement: longBonus,
    });

    expect(highlight.endsWith("…")).toBe(true);
    expect(highlight.length).toBe(140);
    expect(longBonus.startsWith(highlight.slice(0, -1))).toBe(true);
  });
});
