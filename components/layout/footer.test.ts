import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", { href: String(href), ...props }, children),
}));

import { Footer } from "./footer";

const source = readFileSync(new URL("./footer.tsx", import.meta.url), "utf8");

describe("Footer glass contract", () => {
  it("uses a coherent dark-glass panel with responsive grid layout", () => {
    const markup = renderToStaticMarkup(
      createElement(Footer, {
        showBlog: true,
        instagramUrl: "https://instagram.com/example",
      })
    );

    expect(source).toContain("rounded-3xl");
    expect(source).toContain("border-white/10");
    expect(source).toContain("bg-slate-950/70");
    expect(source).toContain("backdrop-blur-xl");
    expect(markup).toContain("grid-cols-1");
    expect(markup).toContain("sm:grid-cols-2");
    expect(markup).toContain("lg:grid-cols-4");
    expect(markup).toContain("Strona główna");
    expect(markup).toContain("Blog");
    expect(markup).toContain("Polityka prywatności");
    expect(markup).toContain('aria-label="Instagram"');
    expect(markup).toContain("min-h-[44px]");
  });

  it("hides blog links and social icons when CMS toggles are off", () => {
    const markup = renderToStaticMarkup(
      createElement(Footer, {
        showBlog: false,
        instagramUrl: null,
        facebookUrl: null,
        tiktokUrl: null,
      })
    );

    expect(markup).not.toContain("Blog");
    expect(markup).not.toContain('aria-label="Instagram"');
    expect(markup).toContain("Regulamin");
  });
});
