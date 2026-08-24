import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface PortableTextBlock {
  _type: string;
  children?: PortableTextChild[];
  [key: string]: unknown;
}

interface PortableTextChild {
  _type: string;
  text?: string;
  [key: string]: unknown;
}

interface LinkValue {
  href: string;
  [key: string]: unknown;
}

interface HeroContent {
  _id: string;
  title: string;
  description: PortableTextBlock[];
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
  return await client.fetch(query, {}, { next: { revalidate: 600, tags: ["heroSection"] } });
}

export async function HeroSection() {
  const heroContent = await getHeroContent();

  const components = {
    block: {
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-0">{children}</p>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-slate-700">{children}</strong>
      ),
      link: ({
        value,
        children,
      }: {
        value?: LinkValue;
        children?: React.ReactNode;
      }) => (
        <a
          href={value?.href}
          className="text-brand underline hover:text-brand-dark"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-light via-white to-teal-50 py-14 sm:py-20 lg:py-28 px-4 sm:px-6">
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-teal-400/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {heroContent?.image && (
          <div className="relative h-14 sm:h-16 lg:h-20 w-full mx-auto max-w-md">
            <Image
              src={urlFor(heroContent.image).width(960).height(240).url()}
              alt="Afiliantka Faceless"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 80vw, 400px"
              priority
            />
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
          {heroContent?.title || "Ekskluzywne oferty partnerskie"}
        </h1>

        <div className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {heroContent?.description ? (
            <PortableText
              value={heroContent.description}
              components={components}
            />
          ) : (
            "Odkryj starannie wyselekcjonowane oferty partnerskie z wysokimi współczynnikami konwersji."
          )}
        </div>

        <div className="pt-2">
          <Link
            href="/oferty"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 min-h-[44px] text-base font-semibold text-white bg-cta hover:bg-cta-hover rounded-xl shadow-lg shadow-cta/25 transition-all duration-200 hover:shadow-xl hover:shadow-cta/30 hover:-translate-y-0.5"
          >
            Zobacz oferty
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
