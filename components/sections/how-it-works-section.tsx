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
      className={`bg-transparent py-16 sm:py-20 px-4 sm:px-6 lg:px-8 ${density.howItWorks}`}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className={`text-white text-2xl sm:text-3xl font-bold mb-4 text-center drop-shadow-sm ${density.howHeading}`}
        >
          Jak to działa?
        </h2>
        <p
          className={`text-white/75 text-center mb-12 max-w-2xl mx-auto ${density.howIntro}`}
        >
          Zacznij zarabiać w kilku prostych krokach
        </p>

        <HowItWorksSteps steps={steps} />
      </div>
    </section>
  );
}
