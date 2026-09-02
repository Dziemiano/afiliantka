import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { Offer } from "@/types/offer";
import { OfferCard } from "@/components/ui/offer-card";
import { Badge } from "@/components/ui/badge";

async function getOffers(): Promise<Offer[]> {
  const query = `*[_type == "offer"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    description,
    image,
    link,
    featured,
    category,
    bonusRequirement,
    files[]{
      _key,
      asset->{
        _ref,
        _type,
        url,
        originalFilename
      }
    },
    slug
  }`;
  return await client.fetch(
    query,
    {},
    { next: { revalidate: 300, tags: ["offers"] } }
  );
}

function OffersContent() {
  return (
    <Suspense
      fallback={<div className="text-center py-8">Ładowanie ofert...</div>}
    >
      <OffersList />
    </Suspense>
  );
}

async function OffersList() {
  const offers = await getOffers();

  return (
    <div>
      {offers.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Brak dostępnych ofert
          </h3>
          <p className="text-gray-600">
            Aktualnie nie ma żadnych ofert w systemie.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="relative">
              <OfferCard offer={offer} />
              {offer.category && (
                <div className="absolute top-2 right-2">
                  <Badge
                    className={
                      offer.category === "personal"
                        ? "bg-blue-500 text-white text-xs"
                        : offer.category === "business"
                          ? "bg-green-500 text-white text-xs"
                          : "bg-purple-500 text-white text-xs"
                    }
                  >
                    {offer.category === "personal"
                      ? "Osobiste"
                      : offer.category === "business"
                        ? "Biznesowe"
                        : "Karty kredytowe"}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OffersPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dostępne oferty
        </h1>
        <p className="text-gray-700">
          Przeglądaj wszystkie dostępne oferty partnerskie. Wybierz 4 oferty
          w ramach procesu onboardingu, aby uzyskać pełny dostęp do platformy.
        </p>
      </div>

      <OffersContent />
    </div>
  );
}
