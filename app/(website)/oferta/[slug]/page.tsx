import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { FileText, ExternalLink, ChevronRight, Home } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { AffiliateDisclosure } from "@/components/affiliate-disclosure";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
} from "@/lib/offer-categories";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantkafaceless.pl";

interface OfferPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: OfferPageProps): Promise<Metadata> {
  const { slug } = await params;
  const offer = await client.fetch(
    `*[_type == "offer" && slug.current == $slug][0]{ title, image }`,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!offer) return { title: "Oferta nie znaleziona" };

  const ogImage = offer.image
    ? urlFor(offer.image).width(1200).height(630).url()
    : undefined;

  return {
    title: offer.title,
    openGraph: {
      title: `${offer.title} | Afiliantka Faceless`,
      type: "website",
      url: `${siteUrl}/oferta/${slug}`,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
  };
}

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "offer" && defined(slug.current)]{ "slug": slug.current }`
  );
  return (slugs || []).map((s) => ({ slug: s.slug }));
}

export default async function OfferPage({ params }: OfferPageProps) {
  const { slug } = await params;
  const offer = await client.fetch(
    `*[_type == "offer" && slug.current == $slug][0]{
      _id,
      title,
      description,
      image,
      link,
      category,
      bonusRequirement,
      files[]{
        _key,
        asset->{ url, originalFilename }
      }
    }`,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!offer) {
    return (
      <div className="px-4 py-20 text-center sm:px-6">
        <p className="mx-auto w-fit rounded-xl bg-slate-950/80 px-5 py-4 text-sm text-white shadow-lg sm:text-base">
          Nie znaleziono oferty.
        </p>
      </div>
    );
  }

  const safeBlocks = Array.isArray(offer.description)
    ? offer.description.filter(
        (block: { _type?: string }) => block && block._type
      )
    : [];
  const categoryLabel = offer.category
    ? CATEGORY_LABELS[offer.category]
    : undefined;
  const categoryStyle = offer.category
    ? CATEGORY_STYLES[offer.category]
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.title,
    url: `${siteUrl}/oferta/${slug}`,
    ...(offer.image && {
      image: urlFor(offer.image).width(1200).height(400).url(),
    }),
  };

  return (
    <div className="min-h-screen bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {offer.image && (
        <div className="relative w-full aspect-[21/9] sm:aspect-[3/1] max-h-[420px] bg-slate-100">
          <Image
            src={urlFor(offer.image).width(1600).height(500).url()}
            alt={offer.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto">
              <nav
                className="flex items-center gap-1.5 text-sm text-white/70 mb-3"
                aria-label="Breadcrumb"
              >
                <Link
                  href="/"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <Home className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only sm:not-sr-only">Strona główna</span>
                </Link>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                <Link href="/oferty" className="hover:text-white transition-colors">
                  Oferty
                </Link>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="text-white truncate">{offer.title}</span>
              </nav>
              {categoryLabel && (
                <span
                  className={`mb-3 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                    categoryStyle || "border-white/30 bg-white/90 text-slate-700"
                  }`}
                >
                  {categoryLabel}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {offer.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-4 my-8 rounded-2xl bg-white/90 px-4 py-8 shadow-sm sm:mx-6 sm:px-6 sm:py-10 md:mx-auto">
        {!offer.image && (
          <>
            <nav
              className="flex items-center gap-1.5 text-sm text-slate-400 mb-6"
              aria-label="Breadcrumb"
            >
              <Link href="/oferty" className="hover:text-brand transition-colors">
                Oferty
              </Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="text-slate-600 truncate">{offer.title}</span>
            </nav>
            <h1
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 ${
                categoryLabel ? "mb-3" : "mb-8"
              }`}
            >
              {offer.title}
            </h1>
            {categoryLabel && (
              <span
                className={`mb-8 inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                  categoryStyle || "border-slate-200 bg-slate-50 text-slate-700"
                }`}
              >
                {categoryLabel}
              </span>
            )}
          </>
        )}

        <div className="prose-offer text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand [&_a]:underline [&_a:hover]:text-brand-dark [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mt-6 [&_h3]:mb-2">
          <PortableText value={safeBlocks} />
        </div>

        {offer.bonusRequirement && (
          <div className="mt-8 rounded-xl border border-brand/20 bg-brand-light/60 px-4 py-4 sm:px-5 sm:py-5">
            <h2 className="text-slate-800 text-base sm:text-lg font-semibold mb-1.5">
              Jak dostać bonus
            </h2>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              {offer.bonusRequirement}
            </p>
          </div>
        )}

        {offer.files && offer.files.length > 0 && (
          <div className="mt-10 pt-8 border-t border-slate-100">
            <h2 className="text-slate-800 text-lg font-semibold mb-4">
              Pliki do pobrania
            </h2>
            <ul className="space-y-3">
              {offer.files.map(
                (
                  file: {
                    asset: {
                      _ref: string;
                      _type: string;
                      url: string;
                      originalFilename?: string;
                    };
                    _key: string;
                  },
                  idx: number
                ) =>
                  file.asset?.url && (
                    <li key={file._key || idx}>
                      <a
                        href={file.asset.url}
                        download={file.asset.originalFilename}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-brand hover:text-brand-dark transition-colors font-medium min-h-[44px]"
                      >
                        <FileText className="h-4 w-4" aria-hidden="true" />
                        {file.asset.originalFilename || `PDF ${idx + 1}`}
                      </a>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}

        <AffiliateDisclosure />

        {offer.link && (
          <div className="mt-8">
            <a
              href={`/go/${slug}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 min-h-[44px] bg-cta hover:bg-cta-hover text-white text-base font-semibold rounded-xl shadow-lg shadow-cta/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              Przejdź do oferty
              <ExternalLink className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
