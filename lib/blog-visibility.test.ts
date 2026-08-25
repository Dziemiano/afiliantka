import { describe, expect, it } from "vitest";
import {
  blogIndexMetadata,
  shouldExposeBlogRoutes,
} from "@/lib/blog-visibility";

describe("shouldExposeBlogRoutes", () => {
  it("is true only when showBlog is true", () => {
    expect(shouldExposeBlogRoutes(true)).toBe(true);
    expect(shouldExposeBlogRoutes(false)).toBe(false);
  });
});

describe("blogIndexMetadata", () => {
  it("returns full blog metadata when enabled", () => {
    const meta = blogIndexMetadata(true);
    expect(meta.title).toBe("Blog");
    expect(meta.robots).toBeUndefined();
  });

  it("returns noindex metadata when disabled", () => {
    const meta = blogIndexMetadata(false);
    expect(meta.title).toBe("Nie znaleziono");
    expect(meta.robots).toEqual({ index: false, follow: false });
  });
});
