import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PublicGlassCard } from "./public-glass-card";
import { PublicPageHero } from "./public-page-hero";
import { PublicSection } from "./public-section";
import {
  publicGlassCardHoverClassName,
  publicGlassSurfaceClassName,
  publicSectionHeadingClassName,
  publicSectionSubheadingClassName,
  publicSolidContentClassName,
} from "@/lib/public-surfaces";

describe("public layout primitives", () => {
  it("PublicGlassCard renders glass surface classes", () => {
    const markup = renderToStaticMarkup(
      createElement(PublicGlassCard, { className: "p-4" }, "Treść")
    );

    expect(markup).toContain(publicGlassSurfaceClassName.split(" ")[0]);
    expect(markup).toContain("rounded-3xl");
    expect(markup).toContain("backdrop-blur-xl");
    expect(markup).toContain("Treść");
  });

  it("PublicSection applies responsive padding and max width", () => {
    const markup = renderToStaticMarkup(
      createElement(
        PublicSection,
        { maxWidth: "5xl", "data-home-section": "test" },
        "Sekcja"
      )
    );

    expect(markup).toContain('data-home-section="test"');
    expect(markup).toContain("max-w-5xl");
    expect(markup).toContain("py-12");
    expect(markup).toContain("Sekcja");
  });

  it("exports solid content surface for long-form pages", () => {
    expect(publicSolidContentClassName).toContain("bg-white/90");
  });

  it("PublicGlassCard supports hover styling and semantic wrappers", () => {
    const hoverMarkup = renderToStaticMarkup(
      createElement(PublicGlassCard, { hover: true, className: "p-4" }, "Hover")
    );
    const detailsMarkup = renderToStaticMarkup(
      createElement(
        PublicGlassCard,
        { as: "details", className: "p-4" },
        "Szczegóły"
      )
    );

    expect(hoverMarkup).toContain(
      publicGlassCardHoverClassName.split(" ")[0]
    );
    expect(detailsMarkup).toContain("<details");
    expect(detailsMarkup).toContain("Szczegóły");
  });

  it("PublicPageHero renders title, subtitle, and shared heading tokens", () => {
    const markup = renderToStaticMarkup(
      createElement(PublicPageHero, {
        title: "Regulamin",
        subtitle: "Zasady korzystania ze strony.",
      })
    );

    expect(markup).toContain("<h1");
    expect(markup).toContain("Regulamin");
    expect(markup).toContain("Zasady korzystania ze strony.");
    expect(markup).toContain(publicSectionHeadingClassName.split(" ")[0]);
    expect(markup).toContain(publicSectionSubheadingClassName.split(" ")[0]);
    expect(markup).toContain("max-w-5xl");
  });
});
