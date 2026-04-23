import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantka.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [offers, blogPosts] = await Promise.all([
    client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      `*[_type == "offer"]{ "slug": slug.current, _updatedAt }`
    ),
    client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      `*[_type == "blog"]{ "slug": slug.current, _updatedAt }`
    ),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/oferty`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  const offerPages: MetadataRoute.Sitemap = (offers || [])
    .filter((o) => o.slug)
    .map((offer) => ({
      url: `${siteUrl}/oferta/${offer.slug}`,
      lastModified: new Date(offer._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogPages: MetadataRoute.Sitemap = (blogPosts || [])
    .filter((p) => p.slug)
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticPages, ...offerPages, ...blogPages];
}
