import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { urlFor } from "@/lib/sanity-image";
import type { Offer } from "@/types/offer";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface OfferCardProps {
  offer: Offer;
  className?: string;
}

export function OfferCard({ offer, className }: OfferCardProps) {
  return (
    <Link href={`/oferta/${offer.slug.current}`}>
      <Card
        className={cn(
          "p-0 m-0 overflow-hidden border-stone-200 bg-white hover:shadow-md transition-shadow duration-200 w-52 flex-shrink-0",
          className
        )}
      >
        {/* Image on top - much smaller */}
        <div className="relative h-24 w-full overflow-hidden">
          <Image
            src={urlFor(offer.image).width(208).height(96).url()}
            alt={offer.title}
            fill
            className="object-cover"
          />
          {offer.featured && (
            <Badge className="absolute top-1 right-1 bg-stone-600 text-white text-[9px] px-1 py-0">
              Polecane
            </Badge>
          )}
        </div>

        {/* Content - very compact */}
        <div className="p-2 m-0 space-y-1">
          {/* Title */}
          <h3 className="text-s font-medium text-stone-700 line-clamp-2 leading-tight p-0 m-0">
            {offer.title}
          </h3>
        </div>
      </Card>
    </Link>
  );
}
