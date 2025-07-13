import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

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
        <h1 className="text-2xl font-bold text-left">{children}</h1>
      ),
      h2: ({ children }: { children?: React.ReactNode }) => (
        <h2 className="text-xl font-bold text-left">{children}</h2>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="text-lg font-bold text-left">{children}</h3>
      ),
      p: ({ children }: { children?: React.ReactNode }) => (
        <p className="mb-4 text-left">{children}</p>
      ),
      blockquote: ({ children }: { children?: React.ReactNode }) => (
        <blockquote className="border-l-4 pl-4 italic text-left">
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
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      ),
    },
  };

  return (
    <section className="bg-gradient-to-br from-stone-100 via-neutral-50 to-amber-50 py-6 px-4 sm:py-8 sm:px-6 lg:px-40">
      <div className="flex flex-1 justify-center">
        <div className="layout-content-container flex flex-col w-full max-w-[960px] flex-1 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-stone-700 text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              {heroContent?.title || "Ekskluzywne Oferty Partnerskie"}
            </h1>
            {/* Description */}
            <div className="text-stone-600 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mx-auto text-left">
              {heroContent?.description ? (
                <PortableText
                  value={heroContent.description}
                  components={components}
                />
              ) : (
                "Odkryj starannie wyselekcjonowane najlepsze oferty partnerskie z wysokimi współczynnikami konwersji."
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
