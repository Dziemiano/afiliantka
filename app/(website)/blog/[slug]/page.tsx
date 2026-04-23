import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantka.pl";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function readingTime(text: string): number {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{ title, content, image }`,
    { slug },
    { next: { revalidate: 300 } }
  );

  if (!post) return { title: "Wpis nie znaleziony" };

  const ogImage = post.image
    ? urlFor(post.image).width(1200).height(630).url()
    : undefined;

  return {
    title: post.title,
    description: post.content?.slice(0, 160),
    openGraph: {
      title: `${post.title} | Blog | Afiliantka Faceless`,
      description: post.content?.slice(0, 160),
      type: "article",
      url: `${siteUrl}/blog/${slug}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "blog" && defined(slug.current)]{ "slug": slug.current }`
  );
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await client.fetch(
    `*[_type == "blog" && slug.current == $slug][0]{
      _id, title, content, image, date, author
    }`,
    { slug },
    { next: { revalidate: 300 } }
  );

  if (!post) {
    return (
      <div className="py-20 text-center text-slate-500">
        Nie znaleziono wpisu.
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    ...(post.author && { author: { "@type": "Person", name: post.author } }),
    url: `${siteUrl}/blog/${slug}`,
    ...(post.image && {
      image: urlFor(post.image).width(900).height(300).url(),
    }),
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link href="/blog" className="hover:text-brand transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-600 truncate">{post.title}</span>
        </nav>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-dark mb-6 min-h-[44px] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Wróć do bloga
        </Link>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
          {post.title}
        </h1>

        <div className="flex items-center text-sm text-slate-400 mb-8 gap-3">
          <span>{new Date(post.date).toLocaleDateString("pl-PL")}</span>
          {post.author && <span>• {post.author}</span>}
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime(post.content)} min czytania
          </span>
        </div>

        {post.image && (
          <div className="w-full aspect-[3/1] relative mb-8 rounded-2xl overflow-hidden bg-slate-100">
            <Image
              src={urlFor(post.image).width(900).height(300).url()}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
            />
          </div>
        )}

        <article className="text-slate-700 text-base sm:text-lg leading-relaxed whitespace-pre-line [&_p]:mb-4">
          {post.content}
        </article>
      </main>
    </div>
  );
}
