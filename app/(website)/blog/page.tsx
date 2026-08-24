import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { excerptFromContent, readingTimeFromContent } from "@/components/blog/blog-content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Aktualności, porady i artykuły dotyczące ofert partnerskich i marketingu afiliacyjnego.",
  openGraph: {
    title: "Blog | Afiliantka Faceless",
    description:
      "Aktualności, porady i artykuły dotyczące ofert partnerskich.",
  },
};

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
  const posts = await getBlogPosts();

  if (posts.length === 0) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">
          Blog
        </h1>
        <p className="text-slate-500">Brak wpisów na blogu.</p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-brand-light via-white to-teal-50 py-10 sm:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Blog
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Aktualności, porady i artykuły o marketingu afiliacyjnym
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto py-10 sm:py-14 px-4 sm:px-6">
        <section className="mb-14">
          <h2 className="text-sm font-semibold text-brand uppercase tracking-wider mb-4">
            Wyróżniony wpis
          </h2>
          <Link
            href={`/blog/${featured.slug?.current || featured._id}`}
            className="group block"
          >
            <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:border-slate-300 group-hover:scale-[1.01]">
              {featured.image?.asset && (
                <div className="relative w-full aspect-[2/1] bg-slate-100 overflow-hidden">
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
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3 group-hover:text-brand transition-colors">
                  {featured.title}
                </h2>
                <div className="flex flex-wrap items-center text-sm text-slate-400 mb-4 gap-3">
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
            </article>
          </Link>
        </section>

        {rest.length > 0 && (
          <section>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">
              Pozostałe wpisy
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((post) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug?.current || post._id}`}
                  className="group block h-full"
                >
                  <article className="bg-white rounded-xl border border-slate-200 overflow-hidden h-full flex flex-col transition-all duration-300 group-hover:shadow-lg group-hover:border-slate-300 group-hover:scale-[1.02]">
                    {post.image?.asset && (
                      <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
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
                      <h4 className="text-base font-semibold text-slate-800 mb-2 group-hover:text-brand transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <div className="flex flex-wrap items-center text-xs text-slate-400 mb-3 gap-2">
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
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <NewsletterSignup source="blog" />
    </div>
  );
}
