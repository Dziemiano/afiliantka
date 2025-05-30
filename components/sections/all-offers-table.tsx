// components/sections/all-offers-table.tsx
import { Offer } from "@/types/offer";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

interface AllOffersTableProps {
  offers: Offer[];
}

export function AllOffersTable({ offers }: AllOffersTableProps) {
  return (
    <section className="py-4">
      <div className="px-40 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="text-center mb-8">
            <h2 className="text-stone-700 text-[22px] font-bold leading-tight tracking-[-0.015em]">
              Wszystkie Oferty
            </h2>
          </div>

          <div className="px-4 py-3">
            <div className="flex overflow-hidden rounded-xl border border-stone-300 bg-white">
              <table className="flex-1">
                <thead>
                  <tr className="bg-white">
                    <th className="px-4 py-3 text-left text-stone-700 w-[400px] text-sm font-medium leading-normal">
                      Bank
                    </th>
                    <th className="px-4 py-3 text-left text-stone-700 w-[400px] text-sm font-medium leading-normal">
                      Oferta
                    </th>
                    <th className="px-4 py-3 text-left text-stone-700 w-[400px] text-sm font-medium leading-normal">
                      Pliki
                    </th>
                    <th className="px-4 py-3 text-left text-stone-700 w-[400px] text-sm font-medium leading-normal">
                      Link
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer._id} className="border-t border-t-stone-300">
                      <td className="h-[60px] px-4 py-2 w-[400px] text-stone-700 text-sm font-normal leading-normal">
                        {offer.title}
                      </td>
                      <td className="h-[60px] px-4 py-2 w-[400px] text-stone-500 text-sm font-normal leading-normal">
                        {offer.description.substring(0, 60)}...
                      </td>
                      <td className="h-[60px] px-4 py-2 w-[400px] text-stone-500 text-sm font-normal leading-normal">
                        {offer.files && offer.files.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {offer.files.slice(0, 1).map((file, index) => {
                              const fileUrl = file?.asset?.url;
                              const fileName =
                                file?.asset?.originalFilename ||
                                `PDF ${index + 1}`;

                              if (!fileUrl) return null;

                              return (
                                <a
                                  key={file._key || index}
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-xs text-stone-600 hover:text-stone-800"
                                >
                                  <FileText className="h-3 w-3" />
                                  {fileName.substring(0, 15)}...
                                </a>
                              );
                            })}
                            {offer.files.length > 1 && (
                              <span className="text-xs text-stone-400">
                                +{offer.files.length - 1} więcej
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400 text-xs">
                            Brak plików
                          </span>
                        )}
                      </td>
                      <td className="h-[60px] px-4 py-2 w-60">
                        <Button
                          asChild
                          size="sm"
                          className="bg-stone-600 hover:bg-stone-700 text-white text-xs"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
