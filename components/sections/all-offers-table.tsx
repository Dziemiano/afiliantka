"use client";

import { Offer } from "@/types/offer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity-image";
import {
  Table,
  TableBody,
  TableCell,
  // TableHead,
  // TableHeader,
  TableRow,
} from "@/components/ui/table";
// description removed from desktop view

interface AllOffersTableProps {
  offers: Offer[];
}

export function AllOffersTable({ offers }: AllOffersTableProps) {
  // no description handling needed

  return (
    <section className="py-6 px-2 sm:px-8 lg:px-16 xl:px-32">
      <div className="flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-[1400px] flex-1">
          <h2 className="text-stone-700 text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
            Wszystkie Oferty
          </h2>

          <div className="w-full">
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {offers.map((offer) => (
                <Card
                  key={offer._id}
                  className="border-stone-300 p-0 mx-4 overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Image/logo */}
                    <div className="relative h-24 w-full overflow-hidden">
                      <Image
                        src={urlFor(offer.image).width(800).height(200).url()}
                        alt={offer.title}
                        fill
                        className="object-cover"
                      />
                      {offer.featured && (
                        <Badge className="absolute top-2 right-2 bg-stone-600 text-white text-xs">
                          Polecane
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <div className="flex items-start justify-between px-4">
                      <h3 className="text-stone-700 text-sm font-medium leading-tight flex-1 pr-2">
                        {offer.title}
                      </h3>
                    </div>

                    {/* Internal CTA */}
                    <div className="px-4 pb-4">
                      <Button
                        asChild
                        size="sm"
                        className="bg-stone-600 hover:bg-stone-700 text-white w-full"
                      >
                        <Link
                          href={`/oferta/${offer.slug.current}`}
                          className="flex items-center justify-center gap-2"
                        >
                          Sprawdź warunki
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <Card className="border-stone-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    {/* <TableHeader>
                      <TableRow className="bg-white border-stone-300">
                        <TableHead className="text-stone-700 font-medium min-w-[120px]">
                          Logo
                        </TableHead>
                        <TableHead className="text-stone-700 font-medium min-w-[320px]">
                          Tytuł
                        </TableHead>
                        <TableHead className="text-stone-700 font-medium min-w-[160px]">
                          Warunki
                        </TableHead>
                        <TableHead className="text-stone-700 font-medium min-w-[160px]">
                          Link zewnętrzny
                        </TableHead>
                      </TableRow>
                    </TableHeader> */}
                    <TableBody>
                      {offers.map((offer) => {
                        return (
                          <TableRow
                            key={offer._id}
                            className="border-stone-300"
                          >
                            {/* Logo */}
                            <TableCell className="py-3">
                              <div className="relative h-10 w-20 overflow-hidden rounded-sm bg-stone-50">
                                <Image
                                  src={urlFor(offer.image)
                                    .width(160)
                                    .height(80)
                                    .url()}
                                  alt={offer.title}
                                  fill
                                  className="object-contain p-1"
                                />
                              </div>
                            </TableCell>

                            {/* Title + featured */}
                            <TableCell className="text-stone-700 text-sm font-normal py-3">
                              <div className="flex items-center gap-2">
                                <span className="line-clamp-2">
                                  {offer.title}
                                </span>
                                {offer.featured && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-stone-600 text-white text-xs flex-shrink-0"
                                  >
                                    Polecane
                                  </Badge>
                                )}
                              </div>
                            </TableCell>

                            {/* Internal button */}
                            <TableCell className="py-3">
                              <Button
                                asChild
                                size="sm"
                                className="bg-stone-600 hover:bg-stone-700 text-white"
                              >
                                <Link
                                  href={`/oferta/${offer.slug.current}`}
                                  className="flex items-center gap-1"
                                >
                                  Sprawdź warunki
                                </Link>
                              </Button>
                            </TableCell>

                            {/* External button */}
                            <TableCell className="py-3">
                              <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="text-stone-700"
                              >
                                <a
                                  href={offer.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                >
                                  Przejdź do oferty
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
