import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import { urlFor } from "@/lib/sanity-image";
import type { Offer } from "@/types/offer";
import { cn } from "@/lib/utils";

interface OfferCardProps {
  offer: Offer;
  className?: string;
}

export function OfferCard({ offer, className }: OfferCardProps) {
  return (
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
        <h3 className="text-xs font-medium text-stone-700 line-clamp-2 leading-tight p-0 m-0">
          {offer.title}
        </h3>

        {/* Description */}
        <p className="text-[9px] text-stone-500 line-clamp-1 p-0 m-0">
          {offer.description.substring(0, 40)}...
        </p>

        {/* All Files - Downloadable */}
        {offer.files &&
          Array.isArray(offer.files) &&
          offer.files.length > 0 && (
            <div className="space-y-1 p-0 m-0">
              <p className="text-[8px] font-medium text-stone-700 p-0 m-0">
                Pliki:
              </p>
              {offer.files.map((file, index) => {
                const fileUrl = file?.asset?.url;
                const fileName =
                  file?.asset?.originalFilename || `PDF ${index + 1}`;

                if (!fileUrl) return null;

                return (
                  <a
                    key={file._key || index}
                    href={fileUrl}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[8px] text-stone-600 hover:text-stone-800 transition-colors p-0 m-0"
                  >
                    <FileText className="h-2 w-2" />
                    <span className="truncate">
                      {fileName.length > 12
                        ? `${fileName.substring(0, 12)}...`
                        : fileName}
                    </span>
                  </a>
                );
              })}
            </div>
          )}

        {/* Button */}
        <div className="pt-1 p-0 m-0">
          <Button
            asChild
            className="bg-stone-600 hover:bg-stone-700 text-white h-5 px-2 py-0 text-[9px] w-full"
          >
            <a
              href={offer.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-0.5"
            >
              Przejdź do oferty
              <ExternalLink className="h-2 w-2" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
