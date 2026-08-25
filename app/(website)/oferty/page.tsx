import type { Metadata } from "next";
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { OffersFilter } from "@/components/sections/offers-filter";
import type { Offer } from "@/types/offer";

export const metadata: Metadata = {
  title: "Oferty bankowe",
  description:
    "Przeglądaj aktualne promocje bankowe — konta osobiste, firmowe i karty kredytowe z bonusem za założenie.",
  openGraph: {
    title: "Oferty bankowe | Afiliantka Faceless",
    description:
      "Przeglądaj aktualne promocje kont i kart — porównaj i wybierz ofertę z korzyścią za założenie.",
  },
};

async function getOffers(): Promise<Offer[]> {
  const query = `*[_type == "offer"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    description,
    image,
    link,
    featured,
    category,
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

async function OffersContent() {
  const offers = await getOffers();
  return <OffersFilter offers={offers} showPageHeader />;
}

export default function OfertyPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Suspense
        fallback={
          <div className="py-16 text-center px-4">
            <p className="text-white/75">Ładowanie ofert...</p>
          </div>
        }
      >
        <OffersContent />
      </Suspense>
    </div>
  );
}
