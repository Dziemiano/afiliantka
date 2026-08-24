import type { Metadata } from "next";
import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { OffersFilter } from "@/components/sections/offers-filter";
import type { Offer } from "@/types/offer";

export const metadata: Metadata = {
  title: "Oferty partnerskie",
  description:
    "Przeglądaj sprawdzone oferty partnerskie — konta osobiste, biznesowe i karty kredytowe z wysokimi współczynnikami konwersji.",
  openGraph: {
    title: "Oferty partnerskie | Afiliantka Faceless",
    description:
      "Przeglądaj sprawdzone oferty partnerskie z wysokimi współczynnikami konwersji.",
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
    <div className="bg-white min-h-screen">
      <Suspense
        fallback={
          <div className="py-16 text-center px-4">
            <p className="text-slate-500">Ładowanie ofert...</p>
          </div>
        }
      >
        <OffersContent />
      </Suspense>
    </div>
  );
}
