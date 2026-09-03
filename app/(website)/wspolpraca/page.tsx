import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { CooperationCta } from "@/components/sections/cooperation-cta";
import {
  ChevronDown,
  Target,
  Package,
  Coins,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import type { CooperationPage } from "@/types/cooperation";
import { PublicPageHero } from "@/components/layout/public-page-hero";
import { PublicSection } from "@/components/layout/public-section";
import { PublicGlassCard } from "@/components/layout/public-glass-card";

const DEFAULT_INVITE_EMAIL = "kontakt@afiliantkafaceless.pl";

const BENEFIT_ICON_MAP: Record<string, LucideIcon> = {
  "🎯": Target,
  "📦": Package,
  "💰": Coins,
  "🤝": Handshake,
  target: Target,
  package: Package,
  coins: Coins,
  handshake: Handshake,
};

const DEFAULT_BENEFIT_ICONS = [Target, Package, Coins, Handshake];

function resolveBenefitIcon(icon: string | undefined, index: number): LucideIcon {
  if (icon && BENEFIT_ICON_MAP[icon]) {
    return BENEFIT_ICON_MAP[icon];
  }
  return DEFAULT_BENEFIT_ICONS[index % DEFAULT_BENEFIT_ICONS.length];
}

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
      icon: "target",
      title: "Model faceless",
      description:
        "Promuj oferty bez budowania własnej publicznej marki. Skup się na treści i konwersji.",
    },
    {
      icon: "package",
      title: "Gotowe materiały",
      description:
        "Dostęp do materiałów promocyjnych, opisów ofert i zasobów przygotowanych przez zespół.",
    },
    {
      icon: "coins",
      title: "Sprawdzone oferty",
      description:
        "Starannie wyselekcjonowane promocje bankowe z wysokimi współczynnikami konwersji.",
    },
    {
      icon: "handshake",
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
    <div className="min-h-screen bg-transparent">
      <PublicPageHero title={heroTitle} subtitle={heroSubtitle}>
        <div className="mt-8 sm:mt-10">
          <CooperationCta inviteEmail={inviteEmail} />
        </div>
      </PublicPageHero>

      <PublicSection maxWidth="5xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center drop-shadow-sm">
          Dlaczego warto dołączyć?
        </h2>
        <p className="text-white/75 text-center mb-10 sm:mb-12 max-w-xl mx-auto">
          Korzyści współpracy w programie Afiliantka Faceless
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = resolveBenefitIcon(benefit.icon, idx);
            return (
              <PublicGlassCard key={`${benefit.title}-${idx}`} hover className="p-6">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-brand/15 text-brand mb-4">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg mb-2">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </PublicGlassCard>
            );
          })}
        </div>
      </PublicSection>

      <PublicSection maxWidth="5xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center drop-shadow-sm">
          Jak dołączyć?
        </h2>
        <p className="text-white/75 text-center mb-10 sm:mb-12 max-w-xl mx-auto">
          Proces dołączenia do programu współpracy
        </p>

        <div className="relative">
          <div className="hidden lg:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-white/30 via-white/70 to-white/30" />

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
                  <div className="absolute -bottom-4 left-1/2 w-0.5 h-8 bg-white/55 sm:hidden" />
                )}

                <PublicGlassCard hover className="w-full p-6">
                  <h3 className="text-slate-900 font-semibold text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </PublicGlassCard>
              </div>
            ))}
          </div>
        </div>
      </PublicSection>

      <PublicSection maxWidth="3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 text-center drop-shadow-sm">
          Pytania o współpracę
        </h2>
        <p className="text-white/75 text-center mb-10 max-w-xl mx-auto">
          Najczęściej zadawane pytania o program współpracy
        </p>

        <div className="space-y-3">
          {faq.map((item, idx) => (
            <PublicGlassCard
              key={`${item.question}-${idx}`}
              hover
              as="details"
              className="group rounded-2xl overflow-hidden"
            >
              <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-5 cursor-pointer text-slate-900 font-medium text-sm sm:text-base min-h-[44px] list-none [&::-webkit-details-marker]:hidden select-none">
                <span>{item.question}</span>
                <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-300">
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-5 pt-0 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-white/45">
                    <div className="pt-4">{item.answer}</div>
                  </div>
                </div>
              </div>
            </PublicGlassCard>
          ))}
        </div>
      </PublicSection>

      <PublicSection maxWidth="3xl" className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-sm">
          Gotowy, żeby dołączyć?
        </h2>
        <p className="text-white/80 mb-8">
          Zaloguj się, jeśli masz już zaproszenie, lub poproś o dostęp do
          programu.
        </p>
        <CooperationCta inviteEmail={inviteEmail} />
      </PublicSection>
    </div>
  );
}
