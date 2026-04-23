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
  return await client.fetch(query);
}

export async function HeroSection() {
  const heroContent = await getHeroContent();

  const components = {
    block: {
      h1: ({ children }: { children?: React.ReactNode }) => (
        <h1 className="text-2xl font-bold">{children}</h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-xl font-bold">{children}</h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-lg font-bold">{children}</h3>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-2">{children}</p>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 border-brand pl-4 italic">
          {children}
        </blockquote>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }: { children?: React.ReactNode }) => (
        <em className="italic">{children}</em>
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
    <section className="bg-gradient-to-br from-brand-light via-white to-teal-50 py-10 sm:py-14 lg:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        {/* AppLogo banner */}
        {heroContent?.image && (
          <div className="relative h-16 sm:h-20 lg:h-24 w-full mx-auto">
            <Image
              src={urlFor(heroContent.image).width(960).height(240).url()}
              alt="Afiliantka Faceless"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
              priority
            />
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
          {heroContent?.title || "Ekskluzywne Oferty Partnerskie"}
        </h1>

        <div className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          {heroContent?.description ? (
            <PortableText
              value={heroContent.description}
              components={components}
            />
          ) : (
            "Odkryj starannie wyselekcjonowane najlepsze oferty partnerskie z wysokimi współczynnikami konwersji."
          )}
        </div>

        <div className="pt-2">
          <Link
            href="/oferty"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-cta hover:bg-cta-hover rounded-xl shadow-lg shadow-cta/25 transition-all duration-200 hover:shadow-xl hover:shadow-cta/30"
          >
            Zobacz oferty
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
