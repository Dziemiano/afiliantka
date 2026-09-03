import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { PublicSection } from "@/components/layout/public-section";
import { PublicGlassCard } from "@/components/layout/public-glass-card";

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
}

async function getHeroContent(): Promise<HeroContent | null> {
  const query = `*[_type == "heroSection"][0] {
    _id,
    title,
    description
  }`;
  return await client.fetch(
    query,
    {},
    { next: { revalidate: 600, tags: ["heroSection"] } }
  );
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
        <strong className="font-semibold text-slate-950">{children}</strong>
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
    <PublicSection
      data-home-section="hero"
      maxWidth="4xl"
      className="py-14 sm:py-20 lg:py-24"
      innerClassName="text-center"
    >
      <PublicGlassCard className="flex flex-col items-center gap-6 sm:gap-8 p-6 sm:p-8 lg:p-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 leading-[1.1] tracking-tight">
          {heroContent?.title || "Aktualne oferty bankowe z bonusem"}
        </h1>

        <div className="text-base sm:text-lg lg:text-xl text-slate-700 leading-relaxed max-w-2xl mx-auto">
          {heroContent?.description ? (
            <PortableText
              value={heroContent.description}
              components={components}
            />
          ) : (
            "Porównaj promocje kont osobistych, firmowych i kart kredytowych. Spełnij warunki i odbierz korzyści za założenie konta."
          )}
        </div>
      </PublicGlassCard>
    </PublicSection>
  );
}
