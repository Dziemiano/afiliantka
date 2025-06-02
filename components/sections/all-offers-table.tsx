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

interface AllOffersTableProps {
  offers: Offer[];
}

export function AllOffersTable({ offers }: AllOffersTableProps) {
  return (
    <section className="py-4 px-4 sm:px-6 lg:px-40">
      <div className="flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1">
          <h2 className="text-stone-700 text-lg sm:text-xl lg:text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
            Wszystkie Oferty
          </h2>

          <div className="w-full">
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {offers.map((offer) => (
                <Card key={offer._id} className="border-stone-300 p-4">
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

                    <p className="text-stone-500 text-xs leading-relaxed">
                      {offer.description.substring(0, 100)}...
                    </p>

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
                        <TableHead className="text-stone-700 font-medium min-w-[150px]">
                          Pliki
                        </TableHead>
                        <TableHead className="text-stone-500 font-medium min-w-[100px]">
                          Akcja
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {offers.map((offer) => (
                        <TableRow key={offer._id} className="border-stone-300">
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
                              {offer.description.substring(0, 80)}...
                            </span>
                          </TableCell>
                          <TableCell className="text-stone-500 text-sm font-normal py-3">
                            {offer.files && offer.files.length > 0 ? (
                              <div className="flex flex-col gap-1">
                                {offer.files.slice(0, 1).map((file, index) => {
                                  const fileUrl = file?.asset?.url;
                                  const fileName =
                                    file?.asset?.originalFilename ||
                                    `PDF ${index + 1}`;

                                  if (!fileUrl) return null;

                                  return (
                                    <Button
                                      key={file._key || index}
                                      variant="ghost"
                                      size="sm"
                                      asChild
                                      className="h-auto p-1 justify-start text-stone-600 hover:text-stone-800"
                                    >
                                      <a
                                        href={fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1"
                                      >
                                        <FileText className="h-3 w-3" />
                                        <span className="text-xs truncate max-w-[100px]">
                                          {fileName.substring(0, 15)}...
                                        </span>
                                      </a>
                                    </Button>
                                  );
                                })}
                                {offer.files.length > 1 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs w-fit"
                                  >
                                    +{offer.files.length - 1} więcej
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-stone-400 text-xs">
                                Brak plików
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            <Button
                              asChild
                              size="sm"
                              className="bg-stone-600 hover:bg-stone-700 text-white"
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
                      ))}
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
