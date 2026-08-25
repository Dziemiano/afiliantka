import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface SiteSettings {
  showBlog: boolean;
  showLogin: boolean;
  logo: SanityImageSource | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  showBlog: true,
  showLogin: true,
  logo: null,
  instagramUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
};

export type SiteSettingsDoc = {
  showBlog?: boolean | null;
  showLogin?: boolean | null;
  logo?: SanityImageSource | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
};

/** Pure normalize — missing/null flags default to true; blank URLs become null. */
export function normalizeSiteSettings(
  doc: SiteSettingsDoc | null | undefined
): SiteSettings {
  if (!doc) return { ...DEFAULT_SITE_SETTINGS };

  return {
    showBlog: doc.showBlog ?? true,
    showLogin: doc.showLogin ?? true,
    logo: doc.logo ?? null,
    instagramUrl: doc.instagramUrl?.trim() || null,
    facebookUrl: doc.facebookUrl?.trim() || null,
    tiktokUrl: doc.tiktokUrl?.trim() || null,
  };
}
