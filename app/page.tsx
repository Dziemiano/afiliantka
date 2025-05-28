export const dynamic ='force-dynamic'

import { Suspense } from "react";
import { client } from "../sanity/lib/client";
import { HeroSection } from "@/components/sections/hero-section";
import { OffersSection } from "@/components/sections/offers-section";
import { OffersGridSkeleton } from "@/components/ui/loading-skeleton";
import { Offer } from "@/types/offer";

async function getOffers(): Promise<Offer[]> {
  const query = `*[_type == "offer"] | order(_createdAt desc)`;
  return await client.fetch(query);
}

async function OffersContent() {
  const offers = await getOffers();
  return <OffersSection offers={offers} />;
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />

      <Suspense
        fallback={
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Offers</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Loading amazing offers...
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
