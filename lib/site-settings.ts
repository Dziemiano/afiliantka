import { client } from "@/sanity/lib/client";
import {
  normalizeSiteSettings,
  type SiteSettings,
  type SiteSettingsDoc,
} from "@/lib/site-settings-normalize";

export type {
  SiteSettings,
  SiteSettingsDoc,
} from "@/lib/site-settings-normalize";
export {
  DEFAULT_SITE_SETTINGS,
  normalizeSiteSettings,
} from "@/lib/site-settings-normalize";

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

  return normalizeSiteSettings(doc);
}
