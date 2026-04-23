import type { Metadata } from "next";
import { Suspense } from "react";
import { AppLogo } from "@/components/app-logo";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { FaqSection } from "@/components/sections/faq-section";
import { OffersFilter } from "@/components/sections/offers-filter";
import { client } from "@/sanity/lib/client";
import type { Offer } from "@/types/offer";

export const metadata: Metadata = {
  title: "Afiliantka Faceless - Sprawdzone Oferty Partnerskie",
  description:
    "Odkryj starannie wyselekcjonowane oferty partnerskie z wysokimi współczynnikami konwersji. Profesjonalne rozwiązania dla Twojego biznesu online.",
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
  return <OffersFilter offers={offers} />;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <AppLogo />
      </Suspense>
      <HowItWorksSection />
      <Suspense
        fallback={
          <div className="py-10 text-center px-4">
            <p className="text-slate-500">Ładowanie ofert...</p>
          </div>
        }
      >
        <OffersContent />
      </Suspense>
      <FaqSection />
    </>
  );
}
