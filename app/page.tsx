export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { client } from "../sanity/lib/client";
import { HeroSection } from "@/components/sections/hero-section";
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
    }
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

export default function Home() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <HeroSection />

        <Suspense
          fallback={
            <div className="py-8 text-center px-4">
              <p className="text-stone-600">Ładowanie ofert...</p>
            </div>
          }
        >
          <OffersContent />
        </Suspense>

        {/* Mobile-Optimized Footer */}
        <footer className="flex flex-col gap-4 px-4 py-6 text-center">
          <p className="text-stone-500 text-xs sm:text-sm font-normal leading-normal">
            @2024 Afiliantka Faceless. Wszelkie prawa zastrzeżone.
          </p>
        </footer>
      </div>
    </div>
  );
}
