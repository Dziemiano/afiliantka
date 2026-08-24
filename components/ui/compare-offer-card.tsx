"use client";

import { OfferCard } from "@/components/ui/offer-card";
import type { Offer } from "@/types/offer";

interface CompareOfferCardProps {
  offer: Offer;
  compareMode: boolean;
  isCompareSelected: boolean;
  onCompareToggle: (offerId: string) => void;
  compareDisabled: boolean;
  className?: string;
}

export function CompareOfferCard({
  offer,
  compareMode,
  isCompareSelected,
  onCompareToggle,
  compareDisabled,
  className,
}: CompareOfferCardProps) {
  return (
    <OfferCard
      offer={offer}
      className={className}
      compareMode={compareMode}
      isCompareSelected={isCompareSelected}
      onCompareToggle={onCompareToggle}
      compareDisabled={compareDisabled}
    />
  );
}
