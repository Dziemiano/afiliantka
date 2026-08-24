import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { CooperationCta } from "@/components/sections/cooperation-cta";
import { ChevronDown } from "lucide-react";
import type { CooperationPage } from "@/types/cooperation";

const DEFAULT_INVITE_EMAIL = "kontakt@afiliantkafaceless.pl";

const DEFAULT_CONTENT: Required<
  Pick<
    CooperationPage,
    "heroTitle" | "heroSubtitle" | "benefits" | "processSteps" | "faq"
  >
> = {
  heroTitle: "Współpraca afiliacyjna bez budowania marki",
  heroSubtitle:
    "Dołącz do programu faceless — promuj sprawdzone oferty bankowe pod własnymi kanałami, bez publicznej ekspozycji. Dostęp wyłącznie na zaproszenie.",
  benefits: [
    {
      icon: "🎯",
      title: "Model faceless",
      description:
        "Promuj oferty bez budowania własnej publicznej marki. Skup się na treści i konwersji.",
    },
    {
      icon: "📦",
      title: "Gotowe materiały",
      description:
        "Dostęp do materiałów promocyjnych, opisów ofert i zasobów przygotowanych przez zespół.",
    },
    {
      icon: "💰",
      title: "Sprawdzone oferty",
      description:
        "Starannie wyselekcjonowane promocje bankowe z wysokimi współczynnikami konwersji.",
    },
    {
      icon: "🤝",
      title: "Wsparcie społeczności",
      description:
        "Dołącz do grona współpracowników i wymieniaj się doświadczeniami w zamkniętym panelu.",
    },
  ],
  processSteps: [
    {
      order: 1,
      title: "Poproś o zaproszenie",
      description:
        "Wyślij wiadomość z prośbą o dołączenie. Administrator prześle Ci zaproszenie na email.",
    },
    {
      order: 2,
      title: "Zaloguj się i przejdź onboarding",
      description:
        "Po otrzymaniu magic linka przejdziesz przez proces onboardingu: materiały, wybór ofert i weryfikacja.",
    },
    {
      order: 3,
      title: "Zacznij promować",
      description:
        "Po akceptacji administratora uzyskasz pełny dostęp do materiałów i zasobów platformy.",
    },
  ],
  faq: [
    {
      question: "Czy mogę się samodzielnie zarejestrować?",
      answer:
        "Nie. Platforma działa w modelu invite-only — dołączenie wymaga zaproszenia od administratora.",
    },
    {
      question: "Czym jest model faceless?",
      answer:
        "Faceless oznacza promowanie ofert bez budowania własnej publicznej marki. Możesz działać pod własnymi kanałami, korzystając z gotowych materiałów platformy.",
    },
    {
      question: "Ile kosztuje udział w programie?",
      answer:
        "Udział w programie współpracy jest bezpłatny. Zarabiasz na prowizjach od promowanych ofert.",
    },
    {
      question: "Jak długo trwa onboarding?",
      answer:
        "Czas onboardingu zależy od Ciebie — obejmuje zapoznanie z materiałami, wybór ofert i spełnienie wymagań bankowych. Administrator weryfikuje postęp na bieżąco.",
    },
  ],
};

export const metadata: Metadata = {
  title: "Współpraca afiliacyjna",
  description:
    "Dołącz do programu współpracy Afiliantka Faceless. Model faceless, gotowe materiały, sprawdzone oferty bankowe. Dostęp na zaproszenie.",
  openGraph: {
    title: "Współpraca afiliacyjna | Afiliantka Faceless",
    description:
      "Promuj oferty bankowe bez budowania marki. Dołącz do programu współpracy — dostęp wyłącznie na zaproszenie.",
  },
};

async function getCooperationPage(): Promise<CooperationPage | null> {
  return await client.fetch(
    `*[_type == "cooperationPage"][0]{
      heroTitle,
      heroSubtitle,
      benefits[]{ title, description, icon },
      processSteps[]{ title, description, order },
      faq[]{ question, answer },
      inviteEmail
    }`,
    {},
    { next: { revalidate: 600, tags: ["cooperationPage"] } }
  );
}

export default async function WspolpracaPage() {
  const cms = await getCooperationPage();

  const heroTitle = cms?.heroTitle || DEFAULT_CONTENT.heroTitle;
  const heroSubtitle = cms?.heroSubtitle || DEFAULT_CONTENT.heroSubtitle;
  const benefits =
    cms?.benefits && cms.benefits.length > 0
      ? cms.benefits
      : DEFAULT_CONTENT.benefits;
  const processSteps = (
    cms?.processSteps && cms.processSteps.length > 0
      ? cms.processSteps
      : DEFAULT_CONTENT.processSteps
  ).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const faq =
    cms?.faq && cms.faq.length > 0 ? cms.faq : DEFAULT_CONTENT.faq;
  const inviteEmail = cms?.inviteEmail || DEFAULT_INVITE_EMAIL;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-light via-white to-teal-50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight">
            {heroTitle}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
            {heroSubtitle}
          </p>
          <CooperationCta inviteEmail={inviteEmail} />
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 text-center">
            Dlaczego warto dołączyć?
          </h2>
          <p className="text-slate-500 text-center mb-10 sm:mb-12 max-w-xl mx-auto">
            Korzyści współpracy w programie Afiliantka Faceless
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((benefit, idx) => (
              <div
                key={`${benefit.title}-${idx}`}
                className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md transition-shadow duration-300"
              >
                {benefit.icon && (
                  <span className="text-2xl mb-3 block" aria-hidden="true">
                    {benefit.icon}
                  </span>
                )}
                <h3 className="text-slate-800 font-semibold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 text-center">
            Jak dołączyć?
          </h2>
          <p className="text-slate-500 text-center mb-10 sm:mb-12 max-w-xl mx-auto">
            Proces dołączenia do programu współpracy
          </p>

          <div className="relative">
            <div className="hidden lg:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-slate-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
              {processSteps.map((step, idx) => (
                <div
                  key={`${step.title}-${idx}`}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="relative z-10 w-14 h-14 bg-brand text-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-brand/20">
                    <span className="font-bold text-lg">{idx + 1}</span>
                  </div>

                  {idx < processSteps.length - 1 && (
                    <div className="absolute -bottom-4 left-1/2 w-0.5 h-8 bg-slate-200 sm:hidden" />
                  )}

                  <div className="bg-white border border-slate-100 rounded-xl p-6 w-full">
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

      {/* FAQ */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 text-center">
            Pytania o współpracę
          </h2>
          <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
            Najczęściej zadawane pytania o program współpracy
          </p>

          <div className="space-y-3">
            {faq.map((item, idx) => (
              <details
                key={`${item.question}-${idx}`}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-5 cursor-pointer text-slate-800 font-medium text-sm sm:text-base min-h-[44px] list-none [&::-webkit-details-marker]:hidden select-none">
                  <span>{item.question}</span>
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-5 pt-0 text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-slate-100">
                      <div className="pt-4">{item.answer}</div>
                    </div>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-brand-light to-teal-50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
            Gotowy, żeby dołączyć?
          </h2>
          <p className="text-slate-600 mb-8">
            Zaloguj się, jeśli masz już zaproszenie, lub poproś o dostęp do
            programu.
          </p>
          <CooperationCta inviteEmail={inviteEmail} />
        </div>
      </section>
    </div>
  );
}
