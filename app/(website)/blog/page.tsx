import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { excerptFromContent, readingTimeFromContent } from "@/components/blog/blog-content";
import { getSiteSettings } from "@/lib/site-settings";
import { blogIndexMetadata } from "@/lib/blog-visibility";
import { PublicPageHero } from "@/components/layout/public-page-hero";
import { PublicSection } from "@/components/layout/public-section";
import { PublicGlassCard } from "@/components/layout/public-glass-card";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return blogIndexMetadata(settings.showBlog);
}

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  content: unknown;
  image?: {
    asset: { _ref: string; _type: string };
  };
  date: string;
  author?: string;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(
    `*[_type == "blog"] | order(date desc) {
      _id, title, slug, content, image, date, author
    }`,
    {},
    { next: { revalidate: 300, tags: ["blog"] } }
  );
}

export default async function BlogPage() {
  const settings = await getSiteSettings();
  if (!settings.showBlog) notFound();

  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return (
      <>
        <PublicPageHero title="Blog" />
        <PublicSection maxWidth="5xl" className="pt-0">
          <p className="text-white/75 text-center">Brak wpisów na blogu.</p>
        </PublicSection>
      </>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-transparent">
      <PublicPageHero
        title="Blog"
        subtitle="Aktualności, porady i artykuły o promocjach bankowych"
      />

      <PublicSection maxWidth="5xl" className="pt-0 pb-8">
        <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4">
          Wyróżniony wpis
        </h2>
        <Link
          href={`/blog/${featured.slug?.current || featured._id}`}
          className="group block"
        >
          <PublicGlassCard
            hover
            as="article"
            className="overflow-hidden p-0 group-hover:scale-[1.01] transition-transform duration-300"
          >
            {featured.image?.asset && (
              <div className="relative w-full aspect-[2/1] bg-slate-100/50 overflow-hidden">
                <Image
                  src={urlFor(featured.image).width(1200).height(600).url()}
                  alt={featured.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 900px) 100vw, 900px"
                  priority
                />
              </div>
            )}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand transition-colors">
                {featured.title}
              </h2>
              <div className="flex flex-wrap items-center text-sm text-slate-500 mb-4 gap-3">
                <time dateTime={featured.date}>
                  {new Date(featured.date).toLocaleDateString("pl-PL")}
                </time>
                {featured.author && <span>• {featured.author}</span>}
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {readingTimeFromContent(featured.content)} min
                </span>
              </div>
              <p className="text-slate-600 line-clamp-3 text-base leading-relaxed">
                {excerptFromContent(featured.content, 240)}
              </p>
            </div>
          </PublicGlassCard>
        </Link>
      </PublicSection>

      {rest.length > 0 && (
        <PublicSection maxWidth="5xl" className="pt-0 pb-12">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 drop-shadow-sm">
            Pozostałe wpisy
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug?.current || post._id}`}
                className="group block h-full"
              >
                <PublicGlassCard
                  hover
                  as="article"
                  className="overflow-hidden h-full flex flex-col p-0 group-hover:scale-[1.02] transition-transform duration-300"
                >
                  {post.image?.asset && (
                    <div className="relative w-full aspect-[16/10] bg-slate-100/50 overflow-hidden">
                      <Image
                        src={urlFor(post.image).width(640).height(400).url()}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-brand transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex flex-wrap items-center text-xs text-slate-500 mb-3 gap-2">
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString("pl-PL")}
                      </time>
                      {post.author && <span>• {post.author}</span>}
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {readingTimeFromContent(post.content)} min
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed mt-auto">
                      {excerptFromContent(post.content, 120)}
                    </p>
                  </div>
                </PublicGlassCard>
              </Link>
            ))}
          </div>
        </PublicSection>
      )}

      <NewsletterSignup source="blog" />
    </div>
  );
}
