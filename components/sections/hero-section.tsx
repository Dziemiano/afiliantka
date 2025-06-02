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
    <section className="bg-gradient-to-br from-stone-100 via-neutral-50 to-amber-50 py-6 px-4 sm:py-8 sm:px-6 lg:px-40">
      <div className="flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1 space-y-8">
          {/* Logo - No Card Wrapper */}
          {heroContent?.image && (
            <div className="relative w-full h-32 sm:h-40 lg:h-48">
              <Image
                src={urlFor(heroContent.image).width(1200).height(300).url()}
                alt="Afiliantka Faceless Logo"
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 960px"
              />
            </div>
          )}

          {/* Hero Content */}
          <div className="text-center space-y-4">
            <h1 className="text-stone-700 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {heroContent?.title || "Ekskluzywne Oferty Partnerskie"}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
              {heroContent?.description ||
                "Odkryj starannie wyselekcjonowane najlepsze oferty partnerskie z wysokimi współczynnikami konwersji."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
