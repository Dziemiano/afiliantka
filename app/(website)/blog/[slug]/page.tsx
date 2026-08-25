import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight, Home } from "lucide-react";
import {
  BlogContent,
  excerptFromContent,
  readingTimeFromContent,
} from "@/components/blog/blog-content";
import { RelatedOffers } from "@/components/sections/related-offers";
import type { Offer } from "@/types/offer";
import { getSiteSettings } from "@/lib/site-settings";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantkafaceless.pl";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const settings = await getSiteSettings();
  if (!settings.showBlog) {
    return { title: "Nie znaleziono", robots: { index: false, follow: false } };
  }

  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{ title, content, image }`,
    { slug },
    { next: { revalidate: 300 } }
  );

  if (!post) return { title: "Wpis nie znaleziony" };

  const description = excerptFromContent(post.content);
  const ogImage = post.image
    ? urlFor(post.image).width(1200).height(630).url()
    : undefined;

  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | Blog | Afiliantka Faceless`,
      description,
      type: "article",
      url: `${siteUrl}/blog/${slug}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

export async function generateStaticParams() {
  const settings = await getSiteSettings();
  if (!settings.showBlog) return [];

  const slugs = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const settings = await getSiteSettings();
  if (!settings.showBlog) notFound();

  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{
      _id,
      title,
      content,
      image,
      date,
      author,
      relatedOffers[]->{
        _id,
        title,
        slug,
        image,
        link,
        featured,
        category,
        description,
        bonusRequirement
      }
    }`,
    { slug },
    { next: { revalidate: 300 } }
  );

  if (!post) {
    return (
      <div className="px-4 py-20 text-center sm:px-6">
        <p className="mx-auto w-fit rounded-xl bg-slate-950/80 px-5 py-4 text-sm text-white shadow-lg sm:text-base">
          Nie znaleziono wpisu.
        </p>
      </div>
    );
  }

  const relatedOffers = (post.relatedOffers || []).filter(
    (offer: Offer | null): offer is Offer => !!offer?.slug?.current
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    ...(post.author && { author: { "@type": "Person", name: post.author } }),
    url: `${siteUrl}/blog/${slug}`,
    ...(post.image && {
      image: urlFor(post.image).width(1200).height(500).url(),
    }),
  };

  return (
    <div className="min-h-screen bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {post.image && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] max-h-[400px] bg-slate-100">
          <Image
            src={urlFor(post.image).width(1400).height(500).url()}
            alt={post.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      )}

      <main className="max-w-3xl mx-4 my-8 rounded-2xl bg-white/90 px-4 py-8 shadow-sm sm:mx-6 sm:px-6 sm:py-10 md:mx-auto">
        <nav
          className="flex items-center gap-1.5 text-sm text-slate-400 mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            href="/"
            className="hover:text-brand transition-colors inline-flex items-center gap-1"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href="/blog" className="hover:text-brand transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-slate-600 truncate">{post.title}</span>
        </nav>

        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark mb-6 min-h-[44px] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Wróć do bloga
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center text-sm text-slate-400 mb-8 gap-3">
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("pl-PL", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {post.author && <span>• {post.author}</span>}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {readingTimeFromContent(post.content)} min czytania
          </span>
        </div>

        <BlogContent content={post.content} />

        {relatedOffers.length > 0 && (
          <RelatedOffers offers={relatedOffers} />
        )}
      </main>
    </div>
  );
}
