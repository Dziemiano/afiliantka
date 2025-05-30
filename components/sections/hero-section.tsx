// components/sections/hero-section.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";

interface HeroContent {
  _id: string;
  title: string;
  description: string;
  image: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}

async function getHeroContent(): Promise<HeroContent | null> {
  const query = `*[_type == "heroSection"][0] {
    _id,
    title,
    description,
    image
  }`;
  return await client.fetch(query);
}

export async function HeroSection() {
  const heroContent = await getHeroContent();

  return (
    <section className="bg-gradient-to-br from-stone-100 via-neutral-50 to-amber-50 py-3">
      <div className="px-40 flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          {/* Compact Hero Image */}
          <div className="px-4 py-2">
            <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white rounded-xl min-h-[120px] relative">
              {heroContent?.image ? (
                <Image
                  src={urlFor(heroContent.image).width(960).height(120).url()}
                  alt="Hero Image"
                  fill
                  className="object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-amber-100 via-stone-200 to-amber-50 rounded-xl"></div>
              )}
            </div>
          </div>

          {/* Hero Content from Sanity */}
          <div className="text-center px-4">
            <h2 className="text-stone-700 text-[22px] font-bold leading-tight pb-2 pt-3">
              {heroContent?.title || "Ekskluzywne Oferty Partnerskie"}
            </h2>
            <p className="text-stone-700 text-sm font-normal leading-normal pb-2 pt-1 text-center max-w-3xl mx-auto">
              {heroContent?.description ||
                "Odkryj starannie wyselekcjonowane najlepsze oferty partnerskie z wysokimi współczynnikami konwersji."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
