import { client } from "@/sanity/lib/client";

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
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold mb-4 text-center">
          Jak to działa?
        </h2>
        <p className="text-slate-500 text-center mb-12 max-w-2xl mx-auto">
          Zacznij zarabiać w kilku prostych krokach
        </p>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-slate-200" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, idx) => (
              <div
                key={step._id}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-brand/20">
                  {step.icon ? (
                    <span className="text-xl">{step.icon}</span>
                  ) : (
                    <span className="font-bold text-lg">{idx + 1}</span>
                  )}
                </div>

                {/* Connecting line (mobile, between items) */}
                {idx < steps.length - 1 && (
                  <div className="absolute -bottom-4 left-1/2 w-0.5 h-8 bg-slate-200 sm:hidden" />
                )}

                <div className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 w-full">
                  <h3 className="text-slate-800 font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
