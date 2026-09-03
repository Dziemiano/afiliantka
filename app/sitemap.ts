import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { getSiteSettings } from "@/lib/site-settings";
import { shouldExposeBlogRoutes } from "@/lib/blog-visibility";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantkafaceless.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  const exposeBlog = shouldExposeBlogRoutes(settings.showBlog);

  const [offers, blogPosts] = await Promise.all([
    client.fetch<Array<{ slug: string; _updatedAt: string }>>(
      `*[_type == "offer"]{ "slug": slug.current, _updatedAt }`
    ),
    exposeBlog
      ? client.fetch<Array<{ slug: string; _updatedAt: string }>>(
          `*[_type == "blog"]{ "slug": slug.current, _updatedAt }`
        )
      : Promise.resolve([]),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/oferty`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...(exposeBlog
      ? [
          {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
        ]
      : []),
    {
      url: `${siteUrl}/wspolpraca`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/polityka-prywatnosci`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/regulamin`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const offerPages: MetadataRoute.Sitemap = (offers || [])
    .filter((o) => o.slug)
    .map((offer) => ({
      url: `${siteUrl}/oferta/${offer.slug}`,
      lastModified: new Date(offer._updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  const blogPages: MetadataRoute.Sitemap = exposeBlog
    ? (blogPosts || [])
        .filter((p) => p.slug)
        .map((post) => ({
          url: `${siteUrl}/blog/${post.slug}`,
          lastModified: new Date(post._updatedAt),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
    : [];

  return [...staticPages, ...offerPages, ...blogPages];
}
