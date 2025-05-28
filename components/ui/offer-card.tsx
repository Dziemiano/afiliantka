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
import { ExternalLink } from "lucide-react";
import { urlFor } from "../../lib/sanity-image";
import { Offer } from "@/types/offer";

interface OfferCardProps {
  offer: Offer;
  featured?: boolean;
}

export function OfferCard({ offer, featured = false }: OfferCardProps) {
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${
        featured ? "ring-2 ring-blue-500 scale-105" : ""
      }`}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={urlFor(offer.image).width(400).height(200).url()}
          alt={offer.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
        {featured && (
          <Badge className="absolute top-3 right-3 bg-blue-600">Featured</Badge>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-2">{offer.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <CardDescription className="line-clamp-3">
          {offer.description}
        </CardDescription>
      </CardContent>

      <CardFooter>
        <Button
          asChild
          className="w-full"
          variant={featured ? "default" : "outline"}
        >
          <a
            href={offer.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            View Offer
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
