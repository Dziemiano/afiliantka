import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity-image";
import type { Offer } from "@/types/offer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "@/lib/offer-categories";

interface OfferCardProps {
  offer: Offer;
  className?: string;
  compareMode?: boolean;
  isCompareSelected?: boolean;
  onCompareToggle?: (offerId: string) => void;
  compareDisabled?: boolean;
}

export function OfferCard({
  offer,
  className,
  compareMode = false,
  isCompareSelected = false,
  onCompareToggle,
  compareDisabled = false,
}: OfferCardProps) {
  return (
    <div className={cn("relative h-full", className)}>
      {compareMode && onCompareToggle && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!compareDisabled || isCompareSelected) {
              onCompareToggle(offer._id);
            }
          }}
          disabled={compareDisabled && !isCompareSelected}
          className={cn(
            "absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-lg text-xs font-medium shadow-sm transition-colors",
            isCompareSelected
              ? "bg-brand text-white"
              : compareDisabled
                ? "bg-white/80 text-slate-400 cursor-not-allowed"
                : "bg-white/95 text-slate-700 hover:bg-brand-light hover:text-brand border border-slate-200"
          )}
          aria-pressed={isCompareSelected}
          aria-label={
            isCompareSelected
              ? "Usuń z porównania"
              : "Dodaj do porównania"
          }
        >
          <Scale className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">
            {isCompareSelected ? "Wybrane" : "Porównaj"}
          </span>
        </button>
      )}

      <Link href={`/oferta/${offer.slug.current}`} className="group block h-full">
        <Card
          className={cn(
            "p-0 overflow-hidden border-slate-200 bg-white h-full flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02] group-hover:border-slate-300",
            isCompareSelected && "ring-2 ring-brand border-brand"
          )}
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
            <Image
              src={urlFor(offer.image).width(640).height(400).url()}
              alt={offer.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {offer.featured && (
                <Badge className="bg-cta text-white text-xs border-0 shadow-sm px-2.5 py-0.5">
                  Polecane
                </Badge>
              )}
              {offer.category && CATEGORY_LABELS[offer.category] && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs border shadow-sm px-2.5 py-0.5",
                    CATEGORY_STYLES[offer.category] ||
                      "bg-slate-50 text-slate-600 border-slate-200"
                  )}
                >
                  {CATEGORY_LABELS[offer.category]}
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4 sm:p-5 flex flex-col flex-1 gap-3">
            <h3 className="text-base sm:text-lg font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-brand transition-colors">
              {offer.title}
            </h3>

            <span className="mt-auto inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-brand group-hover:bg-brand-dark rounded-lg transition-colors duration-200">
              Sprawdź ofertę
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </Card>
      </Link>
    </div>
  );
}
