"use client";

import { Offer } from "@/types/offer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PortableText } from "@portabletext/react";

interface AllOffersTableProps {
  offers: Offer[];
}

interface PortableTextBlock {
  _type: string;
  children?: PortableTextChild[];
  [key: string]: unknown;
}

interface PortableTextChild {
  _type: string;
  text?: string;
  [key: string]: unknown;
}

export function AllOffersTable({ offers }: AllOffersTableProps) {
  const getTruncatedBlocks = (
    blocks: PortableTextBlock[] = [],
    maxLength = 80
  ) => {
    let length = 0;
    const truncated: PortableTextBlock[] = [];
    for (const block of blocks) {
      if (block._type !== "block" || !block.children) continue;
      const children: PortableTextChild[] = [];
      for (const child of block.children) {
        if (length >= maxLength) break;
        const remaining = maxLength - length;
        const text = child.text || "";
        if (text.length > remaining) {
          children.push({
            ...child,
            text: text.substring(0, remaining) + "...",
          });
          length = maxLength;
        } else {
          children.push(child);
          length += text.length;
        }
      }
      if (children.length > 0) {
        truncated.push({ ...block, children });
      }
      if (length >= maxLength) break;
    }
    return truncated;
  };

  console.log("getTruncatedBlocks", getTruncatedBlocks(offers[0].description));

  offers.forEach((offer) => {
    console.log("AllOffersTable description (raw):", offer.description);
  });

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
                <Card key={offer._id} className="border-stone-300 p-4 mx-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="text-stone-700 text-sm font-medium leading-tight flex-1 pr-2">
                        {offer.title}
                      </h3>
                      {offer.featured && (
                        <Badge
                          variant="secondary"
                          className="bg-stone-600 text-white text-xs flex-shrink-0"
                        >
                          Polecane
                        </Badge>
                      )}
                    </div>

                    {/* Files for mobile */}
                    {offer.files && offer.files.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-stone-700 text-xs font-medium">
                          Pliki:
                        </p>
                        {offer.files.slice(0, 2).map((file, index) => {
                          const fileUrl = file?.asset?.url;
                          const fileName =
                            file?.asset?.originalFilename || `PDF ${index + 1}`;

                          if (!fileUrl) return null;

                          return (
                            <Button
                              key={file._key || index}
                              variant="ghost"
                              size="sm"
                              asChild
                              className="h-auto p-1 justify-start text-stone-600 hover:text-stone-800 w-full"
                            >
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                <FileText className="h-3 w-3" />
                                <span className="text-xs truncate">
                                  {fileName}
                                </span>
                              </a>
                            </Button>
                          );
                        })}
                        {offer.files.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{offer.files.length - 2} więcej
                          </Badge>
                        )}
                      </div>
                    )}

                    <PortableText
                      value={getTruncatedBlocks(offer.description, 80)}
                    />

                    <Button
                      asChild
                      size="sm"
                      className="bg-stone-600 hover:bg-stone-700 text-white w-full"
                    >
                      <a
                        href={offer.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        Przejdź do oferty
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block">
              <Card className="border-stone-300 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-white border-stone-300">
                        <TableHead className="text-stone-700 font-medium min-w-[200px]">
                          Oferta
                        </TableHead>
                        <TableHead className="text-stone-700 font-medium min-w-[250px]">
                          Opis
                        </TableHead>
                        <TableHead className="text-stone-500 font-medium min-w-[100px]">
                          Akcja
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((offer) => {
                        return (
                          <TableRow
                            key={offer._id}
                            className="border-stone-300 cursor-pointer hover:bg-stone-100 transition"
                            onClick={() =>
                              (window.location.href = `/oferta/${offer.slug.current}`)
                            }
                            tabIndex={0}
                            role="link"
                            aria-label={`Przejdź do oferty: ${offer.title}`}
                          >
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
                            <TableCell className="text-stone-500 text-sm font-normal py-3">
                              <span className="line-clamp-2">
                                <PortableText
                                  value={getTruncatedBlocks(
                                    offer.description,
                                    80
                                  )}
                                />
                              </span>
                            </TableCell>
                            <TableCell className="py-3">
                              <Button
                                asChild
                                size="sm"
                                className="bg-stone-600 hover:bg-stone-700 text-white"
                                tabIndex={-1}
                              >
                                <a
                                  href={offer.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
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
