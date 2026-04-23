import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { FileText, ExternalLink, ChevronRight } from "lucide-react";
import { PortableText } from "@portabletext/react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantka.pl";

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
      <div className="py-20 text-center text-slate-500">
        Nie znaleziono oferty.
      </div>
    );
  }

  const safeBlocks = Array.isArray(offer.description)
    ? offer.description.filter(
        (block: { _type?: string }) => block && block._type
      )
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: offer.title,
    url: `${siteUrl}/oferta/${slug}`,
    ...(offer.image && {
      image: urlFor(offer.image).width(900).height(300).url(),
    }),
  };

  return (
    <div className="bg-white min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex items-center gap-1.5 text-sm text-slate-400">
          <Link href="/oferty" className="hover:text-brand transition-colors">
            Oferty
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-600 truncate">{offer.title}</span>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
          {offer.title}
        </h1>

        {offer.image && (
          <div className="w-full aspect-[3/1] relative mb-8 rounded-2xl overflow-hidden bg-slate-100">
            <Image
              src={urlFor(offer.image).width(1200).height(400).url()}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
              priority={false}
              loading="lazy"
            />
          </div>
        )}

        <div className="text-slate-700 text-base sm:text-lg leading-relaxed space-y-4 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand [&_a]:underline [&_a:hover]:text-brand-dark">
          <PortableText value={safeBlocks} />
        </div>

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
                        className="inline-flex items-center gap-2 text-brand hover:text-brand-dark transition-colors font-medium"
                      >
                        <FileText className="h-4 w-4" />
                        {file.asset.originalFilename || `PDF ${idx + 1}`}
                      </a>
                    </li>
                  )
              )}
            </ul>
          </div>
        )}

        {offer.link && (
          <div className="mt-10">
            <a
              href={offer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-cta hover:bg-cta-hover text-white text-base font-semibold rounded-xl shadow-lg shadow-cta/25 transition-all duration-200 hover:shadow-xl"
            >
              Przejdź do oferty
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
