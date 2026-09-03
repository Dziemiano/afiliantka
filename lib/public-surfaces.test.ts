import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  publicGlassCardHoverClassName,
  publicGlassSurface,
  publicGlassSurfaceClassName,
  publicSolidContent,
  publicSolidContentClassName,
} from "./public-surfaces";

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

describe("public-surfaces helpers", () => {
  it("merges glass surface tokens with optional hover and extra classes", () => {
    expect(publicGlassSurface()).toBe(publicGlassSurfaceClassName);
    expect(publicGlassSurface("p-4")).toContain("p-4");
    expect(publicGlassSurface("p-4", { hover: true })).toContain(
      publicGlassCardHoverClassName.split(" ")[0]
    );
  });

  it("merges solid content tokens with prose wrappers", () => {
    expect(publicSolidContent()).toBe(publicSolidContentClassName);
    expect(publicSolidContent("prose prose-slate")).toContain("prose");
    expect(publicSolidContent("prose prose-slate")).toContain("bg-white/90");
  });
});

describe("public legal routes contract", () => {
  it("includes legal pages in the sitemap static routes", () => {
    const sitemap = readRepoFile("app/sitemap.ts");

    expect(sitemap).toContain("/polityka-prywatnosci");
    expect(sitemap).toContain("/regulamin");
  });

  it("uses shared hero and solid content surfaces on legal pages", () => {
    for (const page of [
      "app/(website)/polityka-prywatnosci/page.tsx",
      "app/(website)/regulamin/page.tsx",
    ]) {
      const source = readRepoFile(page);

      expect(source).toContain("PublicPageHero");
      expect(source).toContain("publicSolidContent(");
      expect(source).toContain('maxWidth="3xl"');
    }
  });
});
