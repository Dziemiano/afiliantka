"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight } from "lucide-react";
import density from "@/components/sections/homepage-density.module.css";

interface HowItWorksStep {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  order: number;
}

interface HowItWorksStepsProps {
  steps: HowItWorksStep[];
}

export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  return (
    <div className="relative">
      <div
        className={`hidden lg:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-brand/20 via-brand/40 to-brand/20 ${density.stepConnector}`}
      />

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6 ${density.stepsGrid}`}
      >
        {steps.map((step, idx) => (
          <FadeIn key={step._id} delay={idx * 100}>
            <div className="relative flex flex-col items-center text-center h-full">
              <div
                className={`relative z-10 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-brand/25 ${density.stepIcon}`}
              >
                {step.icon ? (
                  <span className="text-xl">{step.icon}</span>
                ) : (
                  <span className="font-bold text-lg">{idx + 1}</span>
                )}
              </div>

              {idx < steps.length - 1 && (
                <div className="absolute -bottom-4 left-1/2 w-0.5 h-8 bg-slate-200 sm:hidden" />
              )}

              {idx < steps.length - 1 && (
                <ArrowRight
                  className="hidden sm:block lg:hidden absolute -right-3 top-5 h-4 w-4 text-slate-300"
                  aria-hidden="true"
                />
              )}

              <div
                className={`bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300 w-full h-full ${density.stepCard}`}
              >
                <h3
                  className={`text-slate-800 font-semibold text-lg mb-2 ${density.stepTitle}`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-slate-500 text-sm leading-relaxed ${density.stepDescription}`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
