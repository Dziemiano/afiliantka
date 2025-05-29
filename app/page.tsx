// app/page.tsx
export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { client } from "../sanity/lib/client";
import { HeroSection } from "@/components/sections/hero-section";
import { OffersSection } from "@/components/sections/offers-section";
import { OffersGridSkeleton } from "@/components/ui/loading-skeleton";
import { Offer } from "@/types/offer";

// app/page.tsx
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
  const offers = await client.fetch(query);
  return offers;
}

async function OffersContent() {
  const offers = await getOffers();
  return <OffersSection offers={offers} />;
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <HeroSection />

      <Suspense
        fallback={
          <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-stone-700">
                  Aktualne Oferty
                </h2>
                <p className="text-stone-600 max-w-2xl mx-auto">
                  Ładowanie dostępnych ofert...
                </p>
              </div>
              <OffersGridSkeleton />
            </div>
          </section>
        }
      >
        <OffersContent />
      </Suspense>
    </main>
  );
}
