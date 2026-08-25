import { client } from "@/sanity/lib/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export interface SiteSettings {
  showBlog: boolean;
  showLogin: boolean;
  logo: SanityImageSource | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
}

const DEFAULT_SETTINGS: SiteSettings = {
  showBlog: true,
  showLogin: true,
  logo: null,
  instagramUrl: null,
  facebookUrl: null,
  tiktokUrl: null,
};

type SiteSettingsDoc = {
  showBlog?: boolean | null;
  showLogin?: boolean | null;
  logo?: SanityImageSource | null;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await client.fetch<SiteSettingsDoc | null>(
    `*[_type == "siteSettings"][0]{
      showBlog,
      showLogin,
      logo,
      instagramUrl,
      facebookUrl,
      tiktokUrl
    }`,
    {},
    { next: { revalidate: 300, tags: ["siteSettings"] } }
  );

  if (!doc) return DEFAULT_SETTINGS;

  return {
    showBlog: doc.showBlog ?? true,
    showLogin: doc.showLogin ?? true,
    logo: doc.logo ?? null,
    instagramUrl: doc.instagramUrl?.trim() || null,
    facebookUrl: doc.facebookUrl?.trim() || null,
    tiktokUrl: doc.tiktokUrl?.trim() || null,
  };
}
