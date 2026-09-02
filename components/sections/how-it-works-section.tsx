import { client } from "@/sanity/lib/client";
import { HowItWorksSteps } from "@/components/sections/how-it-works-steps";
import density from "@/components/sections/homepage-density.module.css";

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
    <section
      data-home-section="how-it-works"
      className={`bg-transparent py-16 sm:py-20 lg:py-3 px-4 sm:px-6 lg:px-8 ${density.howItWorks}`}
    >
      <div
        className={`max-w-5xl mx-auto rounded-3xl border border-white/45 bg-white/45 p-6 sm:p-8 lg:p-3 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl ${density.howSurface}`}
      >
        <h2
          className={`text-slate-950 text-2xl sm:text-3xl font-bold mb-4 lg:mb-1 text-center ${density.howHeading}`}
        >
          Jak to działa?
        </h2>
        <p
          className={`text-slate-700 text-center mb-12 lg:mb-3 max-w-2xl mx-auto ${density.howIntro}`}
        >
          Zacznij zarabiać w kilku prostych krokach
        </p>

        <HowItWorksSteps steps={steps} />
      </div>
    </section>
  );
}
