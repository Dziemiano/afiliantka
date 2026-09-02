import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity-image";
import type { Offer } from "@/types/offer";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "@/lib/offer-categories";
import {
  emphasizeOfferAmounts,
  getOfferHighlights,
} from "@/lib/offer-highlights";
import density from "@/components/sections/homepage-density.module.css";

interface OfferCardProps {
  offer: Offer;
  className?: string;
  compareMode?: boolean;
  isCompareSelected?: boolean;
  onCompareToggle?: (offerId: string) => void;
  compareDisabled?: boolean;
  presentation?: "default" | "homepage";
  variant?: "glass" | "solid";
}

function OfferHighlightText({ text }: { text: string }) {
  const parts = emphasizeOfferAmounts(text);

  return (
    <>
      {parts.map((part, index) =>
        part.bold ? (
          <strong key={`${part.text}-${index}`} className="font-semibold text-slate-900">
            {part.text}
          </strong>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        )
      )}
    </>
  );
}

export function OfferCard({
  offer,
  className,
  compareMode = false,
  isCompareSelected = false,
  onCompareToggle,
  compareDisabled = false,
  presentation = "default",
  variant = "solid",
}: OfferCardProps) {
  const isHomepagePresentation = presentation === "homepage";
  const isGlass = variant === "glass";
  const highlights = getOfferHighlights(offer, isHomepagePresentation ? 3 : 4);

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
            "absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 min-h-[44px] rounded-lg text-xs font-medium shadow-sm transition-colors backdrop-blur-md",
            isCompareSelected
              ? "bg-brand text-white"
              : compareDisabled
                ? "bg-white/50 text-slate-400 cursor-not-allowed"
                : isGlass
                  ? "bg-white/70 text-slate-700 hover:bg-brand-light hover:text-brand border border-white/60"
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
            "p-0 overflow-hidden h-full flex flex-col gap-0 transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]",
            isGlass
              ? "border-white/45 bg-white/45 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl group-hover:border-white/70 group-hover:bg-white/60"
              : "border-slate-200 bg-white group-hover:border-slate-300",
            isCompareSelected && "ring-2 ring-brand border-brand"
          )}
        >
          <div
            className={cn(
              "flex flex-1 flex-col gap-3 p-4 sm:p-5",
              isHomepagePresentation && density.offerBody
            )}
          >
            <div
              className={cn(
                "flex flex-wrap gap-1.5",
                compareMode && "pr-16 sm:pr-24"
              )}
            >
              {offer.featured && (
                <Badge className="bg-cta text-white text-xs border-0 shadow-sm px-2.5 py-0.5">
                  Polecane
                </Badge>
              )}
              {offer.category && CATEGORY_LABELS[offer.category] && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs border shadow-sm px-2.5 py-0.5 backdrop-blur-sm",
                    CATEGORY_STYLES[offer.category] ||
                      (isGlass
                        ? "bg-white/60 text-slate-600 border-white/50"
                        : "bg-slate-50 text-slate-600 border-slate-200")
                  )}
                >
                  {CATEGORY_LABELS[offer.category]}
                </Badge>
              )}
            </div>

            <div
              className={cn(
                "relative mx-auto h-16 w-full max-w-[11rem] sm:h-20",
                isHomepagePresentation && density.offerMedia
              )}
            >
              <Image
                src={urlFor(offer.image).width(480).fit("max").url()}
                alt={offer.title}
                fill
                className="object-contain object-center"
                loading="lazy"
                sizes="180px"
              />
            </div>

            <h3
              className={cn(
                "text-center text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-brand transition-colors",
                isHomepagePresentation && density.offerTitle
              )}
            >
              {offer.title}
            </h3>

            {highlights.length > 0 && (
              <ul className="flex flex-col gap-1.5 text-left">
                {highlights.map((item, index) => (
                  <li
                    key={`${offer._id}-highlight-${index}`}
                    className="flex gap-2 text-sm leading-snug text-slate-700"
                  >
                    <span
                      className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
                      aria-hidden="true"
                    />
                    <span>
                      <OfferHighlightText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            )}

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
