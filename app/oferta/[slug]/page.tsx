// app/offer/[id]/page.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import Link from "next/link";
import { FileText, ExternalLink } from "lucide-react";
import { PortableText } from "@portabletext/react";

export default async function OfferPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  console.log("Offer detail data:", offer);

  if (!offer) {
    return (
      <div className="p-8 text-center text-stone-500">
        Nie znaleziono oferty.
      </div>
    );
  }

  console.log("Offer description (raw):", offer.description);

  return (
    <div className="bg-stone-50 min-h-screen py-6 px-2">
      {/* Breadcrumbs */}
      <div className="max-w-3xl mx-auto mb-4 px-2 text-xs text-stone-400">
        <Link href="/" className="hover:underline">
          Oferty
        </Link>
        <span className="mx-1 text-stone-300">/</span>
        <span className="text-stone-500">Szczegóły oferty</span>
      </div>

      <main className="max-w-3xl mx-auto px-2 sm:px-6">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4 text-left">
          {offer.title}
        </h1>

        {/* Offer Image */}
        {offer.image && (
          <div className="w-full aspect-[3/1] relative mb-6 rounded-xl overflow-hidden bg-stone-100">
            <Image
              src={urlFor(offer.image).width(900).height(300).url()}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
              priority
            />
          </div>
        )}

        {/* Description */}
        <div className="text-stone-700 mb-8 text-base sm:text-lg leading-relaxed">
          <PortableText value={offer.description} />
        </div>

        {/* Files */}
        {offer.files && offer.files.length > 0 && (
          <div className="mb-8">
            <h2 className="text-stone-800 text-base font-semibold mb-2">
              Pliki do pobrania
            </h2>
            <ul className="space-y-2">
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
                        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 underline"
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

        {/* Button */}
        {offer.link && (
          <div className="mt-8">
            <Link
              href={offer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded shadow transition"
            >
              Przejdź do oferty
              <ExternalLink className="h-5 w-5" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
