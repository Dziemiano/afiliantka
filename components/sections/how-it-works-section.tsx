import { client } from "@/sanity/lib/client";
import { HowItWorksSteps } from "@/components/sections/how-it-works-steps";
import { PublicSection } from "@/components/layout/public-section";
import { PublicGlassCard } from "@/components/layout/public-glass-card";

interface HowItWorksStep {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

async function getSteps(): Promise<HowItWorksStep[]> {
  return await client.fetch(
    `*[_type == "howItWorks"] | order(order asc) { _id, title, description, icon, order }`,
    {},
    { next: { revalidate: 600, tags: ["howItWorks"] } }
  );
}

export async function HowItWorksSection() {
  const steps = await getSteps();
  if (steps.length === 0) return null;

  return (
    <PublicSection
      data-home-section="how-it-works"
      maxWidth="5xl"
      className="py-12 sm:py-16 lg:py-20"
    >
      <PublicGlassCard className="p-6 sm:p-8 lg:p-10">
        <h2 className="text-slate-950 text-2xl sm:text-3xl font-bold mb-4 text-center">
          Jak to działa?
        </h2>
        <p className="text-slate-700 text-center mb-12 max-w-2xl mx-auto">
          Skorzystaj z promocji w kilku prostych krokach
        </p>

        <HowItWorksSteps steps={steps} />
      </PublicGlassCard>
    </PublicSection>
  );
}
