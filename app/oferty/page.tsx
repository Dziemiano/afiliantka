export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { client } from "../../sanity/lib/client";
import { FeaturedOffers } from "@/components/sections/featured-offers";
import { AllOffersTable } from "@/components/sections/all-offers-table";
import { Offer } from "@/types/offer";

async function getOffers(): Promise<Offer[]> {
  const query = `*[_type == "offer"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    description,
    image,
    link,
    featured,
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
  return await client.fetch(query);
}

async function OffersContent() {
  const offers = await getOffers();
  return (
    <>
      <FeaturedOffers offers={offers} />
      <AllOffersTable offers={offers} />
    </>
  );
}

export default function OfertyPage() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <h1 className="text-stone-700 text-2xl font-bold text-center py-8">
          Oferty
        </h1>
        <Suspense
          fallback={
            <div className="py-8 text-center px-4">
              <p className="text-stone-600">Ładowanie ofert...</p>
            </div>
          }
        >
          <OffersContent />
        </Suspense>
      </div>
    </div>
  );
}
