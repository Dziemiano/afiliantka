"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Scale, ExternalLink } from "lucide-react";
import { urlFor } from "@/lib/sanity-image";
import type { Offer } from "@/types/offer";
import { CATEGORY_LABELS, CATEGORY_STYLES } from "@/lib/offer-categories";
import { cn } from "@/lib/utils";
import { portableTextToPlainText } from "@/lib/portable-text";

interface OfferComparisonProps {
  offers: Offer[];
  selectedIds: string[];
  onRemove: (id: string) => void;
  onClose: () => void;
  open: boolean;
}

function descriptionPreview(offer: Offer): string {
  const text = portableTextToPlainText(offer.description);
  if (!text) return "—";
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

export function OfferComparison({
  offers,
  selectedIds,
  onRemove,
  onClose,
  open,
}: OfferComparisonProps) {
  const selectedOffers = selectedIds
    .map((id) => offers.find((o) => o._id === id))
    .filter((o): o is Offer => !!o);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || selectedOffers.length === 0) return null;

  const rows: Array<{
    label: string;
    render: (offer: Offer) => React.ReactNode;
  }> = [
    {
      label: "Obraz",
      render: (offer) => (
        <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-slate-100">
          <Image
            src={urlFor(offer.image).width(320).height(200).url()}
            alt={offer.title}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      ),
    },
    {
      label: "Tytuł",
      render: (offer) => (
        <p className="font-semibold text-slate-800 text-sm sm:text-base">
          {offer.title}
        </p>
      ),
    },
    {
      label: "Kategoria",
      render: (offer) =>
        offer.category && CATEGORY_LABELS[offer.category] ? (
          <span
            className={cn(
              "inline-block text-xs font-medium px-2.5 py-1 rounded-full border",
              CATEGORY_STYLES[offer.category]
            )}
          >
            {CATEGORY_LABELS[offer.category]}
          </span>
        ) : (
          <span className="text-slate-400 text-sm">—</span>
        ),
    },
    {
      label: "Polecane",
      render: (offer) => (
        <span className="text-sm text-slate-600">
          {offer.featured ? "Tak" : "Nie"}
        </span>
      ),
    },
    {
      label: "Opis",
      render: (offer) => (
        <p className="text-sm text-slate-600 leading-relaxed">
          {descriptionPreview(offer)}
        </p>
      ),
    },
    {
      label: "Szczegóły",
      render: (offer) => (
        <Link
          href={`/oferta/${offer.slug.current}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-dark min-h-[44px]"
        >
          Zobacz ofertę
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Zamknij porównanie"
      />

      <div className="relative w-full sm:max-w-5xl max-h-[90vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-brand" aria-hidden="true" />
            <h2 id="compare-title" className="text-lg font-bold text-slate-900">
              Porównanie ofert ({selectedOffers.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-auto flex-1 p-4 sm:p-6">
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider p-3 w-28" />
                  {selectedOffers.map((offer) => (
                    <th key={offer._id} className="p-3 align-top min-w-[200px]">
                      <button
                        type="button"
                        onClick={() => onRemove(offer._id)}
                        className="text-xs text-slate-400 hover:text-red-500 mb-2 min-h-[44px]"
                      >
                        Usuń z porównania
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-100">
                    <td className="p-3 text-sm font-medium text-slate-500 align-top">
                      {row.label}
                    </td>
                    {selectedOffers.map((offer) => (
                      <td key={offer._id} className="p-3 align-top">
                        {row.render(offer)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="sm:hidden space-y-6">
            {selectedOffers.map((offer) => (
              <div
                key={offer._id}
                className="border border-slate-200 rounded-xl p-4 space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-800">{offer.title}</p>
                  <button
                    type="button"
                    onClick={() => onRemove(offer._id)}
                    className="text-xs text-slate-400 hover:text-red-500 p-2 min-h-[44px] min-w-[44px]"
                    aria-label="Usuń z porównania"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {rows.map((row) => (
                  <div key={row.label}>
                    <p className="text-xs font-semibold text-slate-400 uppercase mb-1.5">
                      {row.label}
                    </p>
                    {row.render(offer)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface OfferCompareBarProps {
  count: number;
  maxCount: number;
  onCompare: () => void;
  onClear: () => void;
}

export function OfferCompareBar({
  count,
  maxCount,
  onCompare,
  onClear,
}: OfferCompareBarProps) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-4 py-3">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <p className="text-sm text-slate-600 text-center sm:text-left">
          Wybrano{" "}
          <strong className="text-slate-800">
            {count}/{maxCount}
          </strong>{" "}
          {count === 1 ? "ofertę" : "oferty"} do porównania
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClear}
            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            Wyczyść
          </button>
          <button
            type="button"
            onClick={onCompare}
            disabled={count < 2}
            className="flex-1 sm:flex-none px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-brand hover:bg-brand-dark rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Porównaj oferty
          </button>
        </div>
      </div>
    </div>
  );
}
