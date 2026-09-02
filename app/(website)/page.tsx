import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/sections/hero-section";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { FeaturedOffers } from "@/components/sections/featured-offers";
import { FaqSection } from "@/components/sections/faq-section";
import density from "@/components/sections/homepage-density.module.css";
import { client } from "@/sanity/lib/client";
import type { Offer } from "@/types/offer";

export const metadata: Metadata = {
  title: "Afiliantka Faceless — Aktualne oferty bankowe",
  description:
    "Sprawdź aktualne promocje kont i kart. Porównaj oferty i skorzystaj z bonusów za założenie konta.",
};

async function getFeaturedOffers(): Promise<Offer[]> {
  const query = `*[_type == "offer" && featured == true] | order(_createdAt desc) {
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

async function FeaturedOffersContent() {
  const offers = await getFeaturedOffers();
  return <FeaturedOffers offers={offers} />;
}

function AllOffersCta() {
  return (
    <section
      data-home-section="all-offers-cta"
      className={`px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 lg:pt-2 pb-12 sm:pb-16 ${density.allOffersCta}`}
    >
      <div
        className={`max-w-6xl mx-auto flex justify-center border-t border-white/20 pt-8 sm:pt-10 lg:pt-6 ${density.allOffersCtaZone}`}
      >
        <Link
          href="/oferty"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 min-h-[44px] text-base font-semibold text-white bg-cta hover:bg-cta-hover rounded-xl shadow-lg shadow-cta/25 transition-all duration-200 hover:shadow-xl hover:shadow-cta/30 hover:-translate-y-0.5"
        >
          Zobacz wszystkie oferty
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <Suspense
        fallback={
          <div className="py-10 text-center px-4">
            <p className="text-white/75 text-sm sm:text-base">
              Ładowanie ofert...
            </p>
          </div>
        }
      >
        <FeaturedOffersContent />
      </Suspense>
      <AllOffersCta />
      <FaqSection />
    </>
  );
}
