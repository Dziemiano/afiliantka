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

import WebsiteNotFound from "./not-found";

describe("WebsiteNotFound", () => {
  it("renders a glass 404 card with home and offers recovery links", () => {
    const markup = renderToStaticMarkup(createElement(WebsiteNotFound));

    expect(markup).toContain("404");
    expect(markup).toContain("Nie znaleziono strony, której szukasz.");
    expect(markup).toContain('href="/"');
    expect(markup).toContain('href="/oferty"');
    expect(markup).toContain("Strona główna");
    expect(markup).toContain("Oferty");
    expect(markup).toContain("backdrop-blur-xl");
    expect(markup.match(/min-h-\[44px\]/g)).toHaveLength(2);
  });
});
