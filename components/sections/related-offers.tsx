import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity-image";
import { OfferCard } from "@/components/ui/offer-card";
import type { Offer } from "@/types/offer";
import { ArrowRight } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/offer-categories";

interface RelatedOffersProps {
  offers: Offer[];
}

export function RelatedOffers({ offers }: RelatedOffersProps) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-slate-100">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
        Powiązane oferty
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((offer) => (
          <OfferCard key={offer._id} offer={offer} />
        ))}
      </div>
    </section>
  );
}

interface RelatedOffersCompactProps {
  offers: Array<{
    _id: string;
    title: string;
    slug: { current: string };
    image?: Offer["image"];
    category?: Offer["category"];
  }>;
}

export function RelatedOffersCompact({ offers }: RelatedOffersCompactProps) {
  if (!offers || offers.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-slate-100">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
        Powiązane oferty
      </h2>
      <ul className="space-y-3">
        {offers.map((offer) => (
          <li key={offer._id}>
            <Link
              href={`/oferta/${offer.slug.current}`}
              className="group flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors min-h-[44px]"
            >
              {offer.image?.asset && (
                <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                  <Image
                    src={urlFor(offer.image).width(112).height(80).url()}
                    alt={offer.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 group-hover:text-brand transition-colors truncate">
                  {offer.title}
                </p>
                {offer.category && CATEGORY_LABELS[offer.category] && (
                  <p className="text-xs text-slate-500">
                    {CATEGORY_LABELS[offer.category]}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand flex-shrink-0" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
