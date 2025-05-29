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
import { client } from "@/sanity/lib/client";
import { Offer } from "@/types/offer";

interface OfferCardProps {
  offer: Offer;
}

export function OfferCard({ offer }: OfferCardProps) {
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-stone-200 ${
        offer.featured ? "ring-2 ring-stone-400 scale-105" : ""
      }`}
    >
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

      <CardHeader>
        <CardTitle className="line-clamp-2 text-stone-700">
          {offer.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-3 text-stone-600">
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
                // Use the direct URL from Sanity (no need to construct it)
                const fileUrl = file?.asset?.url;
                const fileName =
                  file?.asset?.originalFilename || `PDF ${index + 1}`;

                // Skip if no URL is available
                if (!fileUrl) {
                  console.log("No URL found for file:", file);
                  return null;
                }

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

      <CardFooter className="flex flex-col gap-2">
        <Button
          asChild
          className={`w-full ${
            offer.featured
              ? "bg-stone-600 hover:bg-stone-700 text-white"
              : "bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300"
          }`}
          variant={offer.featured ? "default" : "outline"}
        >
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Zobacz Szczegóły
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
