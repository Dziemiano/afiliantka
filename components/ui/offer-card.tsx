import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity-image";
import type { Offer } from "@/types/offer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface OfferCardProps {
  offer: Offer;
  className?: string;
  variant?: "card" | "compact";
}

const CATEGORY_STYLES: Record<string, string> = {
  personal: "bg-blue-50 text-blue-700 border-blue-200",
  business: "bg-green-50 text-green-700 border-green-200",
  "credit-cards": "bg-amber-50 text-amber-700 border-amber-200",
};

const CATEGORY_LABELS: Record<string, string> = {
  personal: "Osobiste",
  business: "Biznesowe",
  "credit-cards": "Karty kredytowe",
};

function CompactOffer({ offer, className }: { offer: Offer; className?: string }) {
  return (
    <Link
      href={`/oferta/${offer.slug.current}`}
      className={cn(
        "group flex items-center gap-4 px-3 py-3 sm:px-4 hover:bg-slate-50 transition-colors duration-150 min-h-[56px]",
        className
      )}
    >
      <div className="relative w-16 h-11 sm:w-20 sm:h-14 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
        <Image
          src={urlFor(offer.image).width(160).height(112).url()}
          alt={offer.title}
          fill
          className="object-cover"
          loading="lazy"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-3">
        <h3 className="text-sm font-medium text-slate-800 truncate flex-1">
          {offer.title}
        </h3>

        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          {offer.featured && (
            <Badge className="bg-cta text-white text-[10px] border-0 px-2 py-0.5">
              Polecane
            </Badge>
          )}
          {offer.category && CATEGORY_LABELS[offer.category] && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] border px-2 py-0.5",
                CATEGORY_STYLES[offer.category] || "bg-slate-50 text-slate-600 border-slate-200"
              )}
            >
              {CATEGORY_LABELS[offer.category]}
            </Badge>
          )}
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" />
    </Link>
  );
}

function CardOffer({ offer, className }: { offer: Offer; className?: string }) {
  return (
    <Link href={`/oferta/${offer.slug.current}`} className="group block">
      <Card
        className={cn(
          "p-0 overflow-hidden border-slate-200 bg-white transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02] group-hover:border-slate-300",
          className
        )}
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100">
          <Image
            src={urlFor(offer.image).width(480).height(320).url()}
            alt={offer.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2 flex gap-1.5">
            {offer.featured && (
              <Badge className="bg-cta text-white text-[10px] border-0 shadow-sm px-2 py-0.5">
                Polecane
              </Badge>
            )}
            {offer.category && CATEGORY_LABELS[offer.category] && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] border shadow-sm px-2 py-0.5",
                  CATEGORY_STYLES[offer.category] || "bg-slate-50 text-slate-600 border-slate-200"
                )}
              >
                {CATEGORY_LABELS[offer.category]}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-3 space-y-2">
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug">
            {offer.title}
          </h3>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-brand group-hover:gap-2 transition-all duration-200">
            Sprawdź szczegóły
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function OfferCard({ offer, className, variant = "card" }: OfferCardProps) {
  if (variant === "compact") {
    return <CompactOffer offer={offer} className={className} />;
  }
  return <CardOffer offer={offer} className={className} />;
}
