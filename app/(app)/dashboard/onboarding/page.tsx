"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CheckCircle2,
  Circle,
  FileText,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Clock,
  Check,
  Download,
  AlertTriangle,
  X,
  Building2,
  ClipboardCheck,
} from "lucide-react";
import type {
  OnboardingStatus,
  UserOnboarding,
  UserOfferSelection,
} from "@/types/onboarding";

interface SanityOffer {
  _id: string;
  title: string;
  requirement: string | null;
  category: string;
  featured: boolean;
  slug: string;
  imageUrl: string | null;
}

interface OnboardingFile {
  name: string;
  inlineUrl: string;
  downloadUrl: string;
}

const STEPS: { key: OnboardingStatus; label: string }[] = [
  { key: "reading_pdf", label: "Materiały" },
  { key: "selecting_offers", label: "Oferty i konta" },
  { key: "accounts_verified", label: "Materiały dodatkowe" },
  { key: "pending_approval", label: "Zatwierdzenie" },
  { key: "approved", label: "Gotowe" },
];

function stepIndex(status: OnboardingStatus): number {
  if (status === "completing_requirements") return 1;
  return STEPS.findIndex((s) => s.key === status);
}

export default function OnboardingFlowPage() {
  const [onboarding, setOnboarding] = useState<UserOnboarding | null>(null);
  const [selections, setSelections] = useState<UserOfferSelection[]>([]);
  const [offers, setOffers] = useState<SanityOffer[]>([]);
  const [pdfUrl, setPdfUrl] = useState<OnboardingFile | null>(null);
  const [verifiedFile, setVerifiedFile] = useState<OnboardingFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [heroWelcome, setHeroWelcome] = useState<{
    title: string | null;
    description: string | null;
  }>({ title: null, description: null });

  const fetchStatus = useCallback(async () => {
    const res = await fetch("/api/onboarding/status");
    if (res.ok) {
      const data = await res.json();
      setOnboarding(data.onboarding);
      setSelections(data.selections);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchStatus();

      const [offersRes, pdfRes, verifiedRes, profileRes, heroRes] =
        await Promise.allSettled([
          fetch("/api/onboarding/offers"),
          fetch("/api/drive/list?section=onboard"),
          fetch("/api/drive/list?section=onboard-verified"),
          fetch("/api/user/profile"),
          fetch("/api/hero"),
        ]);

      if (offersRes.status === "fulfilled" && offersRes.value.ok) {
        const data = await offersRes.value.json();
        setOffers(data.offers || []);
      }

      if (pdfRes.status === "fulfilled" && pdfRes.value.ok) {
        const files = await pdfRes.value.json();
        const pdf = findPdf(files);
        if (pdf) setPdfUrl(pdf);
      }

      if (verifiedRes.status === "fulfilled" && verifiedRes.value.ok) {
        const files = await verifiedRes.value.json();
        const pdf = findPdf(files);
        if (pdf) setVerifiedFile(pdf);
      }

      if (profileRes.status === "fulfilled" && profileRes.value.ok) {
        const profile = await profileRes.value.json();
        setUserName(
          profile.user?.user_metadata?.full_name ||
            profile.user?.email?.split("@")[0] ||
            null
        );
      }

      if (heroRes.status === "fulfilled" && heroRes.value.ok) {
        const hero = await heroRes.value.json();
        setHeroWelcome({ title: hero.title, description: hero.description });
      }

      setLoading(false);
    };
    init();
  }, [fetchStatus]);

  const transitionStatus = async (status: string) => {
    setSubmitting(true);
    await fetch("/api/onboarding/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await fetchStatus();
    setSubmitting(false);
  };

  const handleAddOffer = async (offer: SanityOffer) => {
    setSubmitting(true);
    const res = await fetch("/api/onboarding/select-offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add",
        offer: {
          sanity_id: offer._id,
          slug: offer.slug,
          name: offer.title,
          requirement_text: offer.requirement || null,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setSelections(data.selections);
    }
    setSubmitting(false);
  };

  const handleRemoveOffer = async (sanityId: string) => {
    setSubmitting(true);
    const res = await fetch("/api/onboarding/select-offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "remove",
        offer: {
          sanity_id: sanityId,
          slug: "",
          name: "",
          requirement_text: null,
        },
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setSelections(data.selections);
    }
    setSubmitting(false);
  };

  const handleToggleAccount = async (
    selectionId: string,
    opened: boolean
  ) => {
    setSelections((prev) =>
      prev.map((s) =>
        s.id === selectionId ? { ...s, account_opened: opened } : s
      )
    );

    await fetch("/api/onboarding/open-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selection_id: selectionId, opened }),
    });
  };

  const handleToggleRequirement = async (
    selectionId: string,
    completed: boolean
  ) => {
    setSelections((prev) =>
      prev.map((s) =>
        s.id === selectionId ? { ...s, requirement_completed: completed } : s
      )
    );

    const res = await fetch("/api/onboarding/complete-requirement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selection_id: selectionId, completed }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.all_completed) {
        await fetchStatus();
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!onboarding) return null;

  const currentStep = stepIndex(onboarding.status);
  const isOffersStep =
    onboarding.status === "selecting_offers" ||
    onboarding.status === "completing_requirements" ||
    onboarding.status === "accounts_verified";

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1">
          {userName ? `Witaj, ${userName}!` : "Proces onboardingu"}
        </h1>
        {heroWelcome.title && (
          <p className="text-lg font-semibold text-stone-700 mb-1">
            {heroWelcome.title}
          </p>
        )}
        {heroWelcome.description && typeof heroWelcome.description === "string" ? (
          <p className="text-stone-600 text-sm leading-relaxed">
            {heroWelcome.description}
          </p>
        ) : (
          <p className="text-stone-600 text-sm">
            Wykonaj poniższe kroki, aby uzyskać pełny dostęp do platformy.
          </p>
        )}
      </div>

      {/* Progress stepper: vertical on mobile, horizontal on md+ */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-8 md:mb-10 md:overflow-x-auto md:pb-2">
        {STEPS.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          return (
            <div key={step.key} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  done
                    ? "bg-green-100 text-green-700"
                    : active
                      ? "bg-blue-100 text-blue-700"
                      : "bg-stone-100 text-stone-400"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 flex-shrink-0" />
                )}
                {step.label}
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight className="h-4 w-4 text-stone-300 flex-shrink-0 hidden md:block" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      {onboarding.status === "reading_pdf" && (
        <StepReadPdf
          pdfUrl={pdfUrl}
          onNext={() => transitionStatus("selecting_offers")}
          submitting={submitting}
        />
      )}

      {isOffersStep && (
        <StepOffersAndRequirements
          offers={offers}
          selections={selections}
          onAddOffer={handleAddOffer}
          onRemoveOffer={handleRemoveOffer}
          onToggleAccount={handleToggleAccount}
          onToggleRequirement={handleToggleRequirement}
          onBack={() => transitionStatus("reading_pdf")}
          submitting={submitting}
          status={onboarding.status}
          verifiedFile={verifiedFile}
        />
      )}

      {onboarding.status === "pending_approval" && <StepPendingApproval />}

      {onboarding.status === "approved" && <StepApproved />}
    </div>
  );
}

/* ---------- Helpers ---------- */

function findPdf(
  files: Array<{ name: string; id: string; mimeType: string }>
): OnboardingFile | null {
  const pdf = files.find(
    (f) =>
      f.mimeType === "application/pdf" ||
      f.name.toLowerCase().endsWith(".pdf")
  );
  if (!pdf) return null;
  return {
    name: pdf.name,
    inlineUrl: `/api/drive/download?fileId=${pdf.id}&inline=true`,
    downloadUrl: `/api/drive/download?fileId=${pdf.id}`,
  };
}

/* ---------- Step 1: Read PDF ---------- */

function StepReadPdf({
  pdfUrl,
  onNext,
  submitting,
}: {
  pdfUrl: OnboardingFile | null;
  onNext: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <FileText className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-blue-900">
              Materiały onboardingowe
            </h2>
            <p className="text-sm text-blue-700 mt-1">
              Zapoznaj się z poniższym dokumentem, a następnie przejdź do wyboru
              ofert.
            </p>
          </div>
        </div>
      </div>

      {pdfUrl ? (
        <div className="border border-stone-200 rounded-lg overflow-hidden">
          <div className="bg-stone-50 px-4 py-3 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-stone-700">
                {pdfUrl.name}
              </span>
            </div>
            <a
              href={pdfUrl.downloadUrl}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              Pobierz PDF
            </a>
          </div>
          <iframe
            src={pdfUrl.inlineUrl}
            className="w-full h-[50vh] sm:h-[60vh] md:h-[70vh] bg-white"
            title="Onboarding PDF"
          />
        </div>
      ) : (
        <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
          <FileText className="h-12 w-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500">
            Brak dokumentu PDF. Skontaktuj się z administratorem.
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onNext}
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-3 min-h-[44px] bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          Zapoznałem się — przejdź dalej
        </button>
      </div>
    </div>
  );
}

/* ---------- Step 2: Offers, accounts & requirements ---------- */

function StepOffersAndRequirements({
  offers,
  selections,
  onAddOffer,
  onRemoveOffer,
  onToggleAccount,
  onToggleRequirement,
  onBack,
  submitting,
  status,
  verifiedFile,
}: {
  offers: SanityOffer[];
  selections: UserOfferSelection[];
  onAddOffer: (offer: SanityOffer) => void;
  onRemoveOffer: (sanityId: string) => void;
  onToggleAccount: (selectionId: string, opened: boolean) => void;
  onToggleRequirement: (selectionId: string, completed: boolean) => void;
  onBack: () => void;
  submitting: boolean;
  status: OnboardingStatus;
  verifiedFile: OnboardingFile | null;
}) {
  const selectedSanityIds = new Set(selections.map((s) => s.offer_sanity_id));
  const accountsCount = selections.filter((s) => s.account_opened).length;
  const completedCount = selections.filter(
    (s) => s.requirement_completed
  ).length;
  const hasRejections = selections.some((s) => s.rejection_reason);
  const allAccountsOpened =
    selections.length === 4 && accountsCount === 4;
  const isVerified = status === "accounts_verified";

  const categoryLabels: Record<string, string> = {
    personal: "Osobiste",
    business: "Biznesowe",
    "credit-cards": "Karty kredytowe",
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-amber-900">
          Wybierz 4 oferty, otwórz konta i zrealizuj wymagania
        </h2>
        <p className="text-sm text-amber-700 mt-1">
          Dla każdej wybranej oferty zaznacz otwarcie konta bankowego oraz
          realizację wymagania. Po otwarciu wszystkich 4 kont administrator
          zweryfikuje je i udostępni dodatkowe materiały.
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-amber-800">
          <span>Wybrano: {selections.length}/4</span>
          <span className="flex items-center gap-1">
            <Building2 className="h-3.5 w-3.5" />
            Konta: {accountsCount}/4
          </span>
          <span className="flex items-center gap-1">
            <ClipboardCheck className="h-3.5 w-3.5" />
            Wymagania: {completedCount}/4
          </span>
        </div>
      </div>

      {/* Accounts opened notification */}
      {allAccountsOpened && !isVerified && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-800">
              Wszystkie konta otwarte — oczekiwanie na weryfikację
            </p>
            <p className="text-xs text-blue-600 mt-0.5">
              Administrator został powiadomiony i wkrótce zweryfikuje Twoje
              konta. Po weryfikacji otrzymasz dostęp do dodatkowych materiałów.
            </p>
          </div>
        </div>
      )}

      {/* Verified file access */}
      {isVerified && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-green-900">
                Konta zweryfikowane — materiały dodatkowe
              </h3>
              <p className="text-sm text-green-700 mt-1">
                Administrator zweryfikował Twoje konta. Poniżej znajdziesz
                dodatkowe materiały. Kontynuuj realizację wymagań.
              </p>
            </div>
          </div>
          {verifiedFile ? (
            <div className="border border-green-200 rounded-lg overflow-hidden">
              <div className="bg-white/50 px-4 py-3 border-b border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-stone-700">
                    {verifiedFile.name}
                  </span>
                </div>
                <a
                  href={verifiedFile.downloadUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Pobierz
                </a>
              </div>
              <iframe
                src={verifiedFile.inlineUrl}
            className="w-full h-[40vh] sm:h-[50vh] bg-white"
            title="Materiały dodatkowe"
              />
            </div>
          ) : (
            <div className="text-center py-8 bg-white/50 rounded-lg border border-green-200">
              <FileText className="h-10 w-10 text-stone-300 mx-auto mb-2" />
              <p className="text-stone-500 text-sm">
                Brak dodatkowych materiałów. Skontaktuj się z administratorem.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Rejection alert */}
      {hasRejections && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Administrator odrzucił jedną lub więcej ofert
            </p>
            <p className="text-xs text-red-600 mt-0.5">
              Sprawdź poniższe oferty i zmień je lub popraw wymagania.
            </p>
          </div>
        </div>
      )}

      {/* Selected offers with accounts & requirements */}
      {selections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
            Twoje wybrane oferty
          </h3>
          {selections.map((sel) => (
            <SelectedOfferCard
              key={sel.id}
              selection={sel}
              onToggleAccount={onToggleAccount}
              onToggleRequirement={onToggleRequirement}
              onRemove={onRemoveOffer}
              canRemove={!sel.requirement_completed && !sel.account_opened}
              submitting={submitting}
            />
          ))}
        </div>
      )}

      {/* Available offers */}
      {selections.length < 4 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider">
            Dostępne oferty
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {offers
              .filter((o) => !selectedSanityIds.has(o._id))
              .map((offer) => (
                <button
                  key={offer._id}
                  onClick={() => onAddOffer(offer)}
                  disabled={submitting}
                  className="text-left p-4 rounded-lg border border-stone-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all disabled:opacity-50"
                >
                  <h4 className="font-medium text-stone-900 truncate">
                    {offer.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                      {categoryLabels[offer.category] || offer.category}
                    </span>
                    {offer.featured && (
                      <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded">
                        Polecane
                      </span>
                    )}
                  </div>
                  {offer.requirement && (
                    <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                      Wymaganie: {offer.requirement}
                    </p>
                  )}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="flex justify-start pt-4">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-4 py-3 min-h-[44px] text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Wróć do materiałów
        </button>
      </div>
    </div>
  );
}

/* ---------- Selected offer card with TWO checkboxes ---------- */

function SelectedOfferCard({
  selection,
  onToggleAccount,
  onToggleRequirement,
  onRemove,
  canRemove,
  submitting,
}: {
  selection: UserOfferSelection;
  onToggleAccount: (id: string, opened: boolean) => void;
  onToggleRequirement: (id: string, completed: boolean) => void;
  onRemove: (sanityId: string) => void;
  canRemove: boolean;
  submitting: boolean;
}) {
  const hasRejection = !!selection.rejection_reason;
  const bothDone = selection.account_opened && selection.requirement_completed;

  return (
    <div
      className={`p-4 sm:p-5 rounded-lg border-2 transition-all ${
        hasRejection
          ? "border-red-300 bg-red-50"
          : bothDone
            ? "border-green-300 bg-green-50"
            : selection.account_opened
              ? "border-blue-200 bg-blue-50/30"
              : "border-stone-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-medium text-stone-900">{selection.offer_name}</h3>
        {canRemove && (
          <button
            onClick={() => onRemove(selection.offer_sanity_id)}
            disabled={submitting}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Usuń ofertę"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {selection.requirement_text && (
        <p className="text-sm text-stone-600 mb-4">
          {selection.requirement_text}
        </p>
      )}

      {/* Two checkboxes */}
      <div className="space-y-2">
        <button
          onClick={() =>
            onToggleAccount(selection.id, !selection.account_opened)
          }
          disabled={submitting}
          className="w-full flex items-center gap-3 p-3 rounded-md border border-stone-200 hover:bg-stone-50 transition-colors text-left disabled:opacity-50"
        >
          {selection.account_opened ? (
            <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
          ) : (
            <Circle className="h-5 w-5 text-stone-300 flex-shrink-0" />
          )}
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-stone-400" />
            <span
              className={`text-sm font-medium ${selection.account_opened ? "text-blue-700" : "text-stone-700"}`}
            >
              Konto otwarte
            </span>
          </div>
          {selection.account_opened_at && (
            <span className="ml-auto text-xs text-blue-500">
              {new Date(selection.account_opened_at).toLocaleDateString(
                "pl-PL"
              )}
            </span>
          )}
        </button>

        <button
          onClick={() =>
            onToggleRequirement(
              selection.id,
              !selection.requirement_completed
            )
          }
          disabled={submitting}
          className="w-full flex items-center gap-3 p-3 rounded-md border border-stone-200 hover:bg-stone-50 transition-colors text-left disabled:opacity-50"
        >
          {selection.requirement_completed ? (
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
          ) : (
            <Circle className="h-5 w-5 text-stone-300 flex-shrink-0" />
          )}
          <div className="flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-stone-400" />
            <span
              className={`text-sm font-medium ${selection.requirement_completed ? "text-green-700" : "text-stone-700"}`}
            >
              Wymaganie zrealizowane
            </span>
          </div>
          {selection.completed_at && !hasRejection && (
            <span className="ml-auto text-xs text-green-500">
              {new Date(selection.completed_at).toLocaleDateString("pl-PL")}
            </span>
          )}
        </button>
      </div>

      {hasRejection && (
        <div className="mt-3 p-3 bg-red-100 rounded-md border border-red-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-800">
                Odrzucone przez administratora
              </p>
              <p className="text-xs text-red-700 mt-0.5">
                {selection.rejection_reason}
              </p>
              <p className="text-xs text-red-500 mt-1">
                Możesz usunąć tę ofertę i wybrać inną.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Step 4: Pending Approval ---------- */

function StepPendingApproval() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock className="h-10 w-10 text-amber-600" />
      </div>
      <h2 className="text-xl font-semibold text-stone-900 mb-2">
        Oczekiwanie na zatwierdzenie
      </h2>
      <p className="text-stone-600 max-w-md mx-auto">
        Ukończyłeś wszystkie wymagania onboardingu. Administrator został
        powiadomiony i wkrótce zatwierdzi Twoje konto, aby uzyskać pełny dostęp
        do platformy.
      </p>
    </div>
  );
}

/* ---------- Step 5: Approved ---------- */

function StepApproved() {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-stone-900 mb-2">
        Onboarding zakończony!
      </h2>
      <p className="text-stone-600 max-w-md mx-auto mb-6">
        Twoje konto zostało zatwierdzone. Masz teraz pełny dostęp do platformy.
      </p>
      <a
        href="/dashboard"
        className="inline-flex px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
      >
        Przejdź do panelu
      </a>
    </div>
  );
}
