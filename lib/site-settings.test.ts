import { describe, expect, it } from "vitest";
import {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
} from "@/lib/site-settings-normalize";

describe("normalizeSiteSettings", () => {
  it("returns safe defaults when document is missing", () => {
    expect(normalizeSiteSettings(null)).toEqual(DEFAULT_SITE_SETTINGS);
    expect(normalizeSiteSettings(undefined)).toEqual(DEFAULT_SITE_SETTINGS);
  });

  it("defaults showBlog and showLogin to true when unset", () => {
    expect(normalizeSiteSettings({})).toMatchObject({
      showBlog: true,
      showLogin: true,
    });
  });

  it("respects explicit false toggles", () => {
    expect(
      normalizeSiteSettings({ showBlog: false, showLogin: false })
    ).toMatchObject({
      showBlog: false,
      showLogin: false,
    });
  });

  it("trims social URLs and treats blank as null", () => {
    expect(
      normalizeSiteSettings({
        instagramUrl: "  https://instagram.com/x  ",
        facebookUrl: "   ",
        tiktokUrl: null,
      })
    ).toMatchObject({
      instagramUrl: "https://instagram.com/x",
      facebookUrl: null,
      tiktokUrl: null,
    });
  });
});
