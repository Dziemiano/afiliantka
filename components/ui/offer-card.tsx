// components/ui/offer-card.tsx
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import { urlFor } from "@/lib/sanity-image";
import { Offer } from "@/types/offer";

interface OfferCardProps {
  offer: Offer;
  variant?: "featured" | "default";
}

export function OfferCard({ offer, variant = "default" }: OfferCardProps) {
  if (variant === "featured") {
    return (
      <div className="flex h-full flex-col gap-3 rounded-lg min-w-60">
        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl flex flex-col relative overflow-hidden">
          <Image
            src={urlFor(offer.image).width(240).height(135).url()}
            alt={offer.title}
            fill
            className="object-cover"
          />
          {offer.featured && (
            <Badge className="absolute top-2 right-2 bg-stone-600 text-white text-xs px-2 py-1">
              Polecane
            </Badge>
          )}
        </div>
        <div className="px-1">
          <p className="text-stone-700 text-sm font-medium leading-normal mb-1 line-clamp-2">
            {offer.title}
          </p>
          <p className="text-stone-500 text-xs font-normal leading-normal line-clamp-3">
            {offer.description.substring(0, 80)}...
          </p>
        </div>
      </div>
    );
  }

  // Default card layout for grid
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-stone-200">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={urlFor(offer.image).width(400).height(200).url()}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        {offer.featured && (
          <Badge className="absolute top-3 right-3 bg-stone-600 text-white">
            Polecane
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 text-stone-700 text-base">
          {offer.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3 text-stone-600 text-sm">
          {offer.description}
        </CardDescription>

        {/* Display PDF files */}
        {offer.files &&
          Array.isArray(offer.files) &&
          offer.files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-stone-700">
                Pliki do pobrania:
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-stone-600 hover:text-stone-800 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    {fileName}
                  </a>
                );
              })}
            </div>
          )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          className="w-full bg-stone-600 hover:bg-stone-700 text-white"
        >
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Promuj
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
