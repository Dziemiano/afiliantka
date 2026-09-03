import type { Metadata } from "next";
import { PublicPageHero } from "@/components/layout/public-page-hero";
import { PublicSection } from "@/components/layout/public-section";
import { publicSolidContent } from "@/lib/public-surfaces";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin korzystania ze strony publicznej Afiliantka Faceless.",
};

export default function RegulaminPage() {
  return (
    <>
      <PublicPageHero
        title="Regulamin"
        subtitle="Zasady korzystania ze strony publicznej Afiliantka Faceless."
      />
      <PublicSection maxWidth="3xl" className="pt-0 pb-16 sm:pb-20">
        <article
          className={publicSolidContent(
            "prose prose-slate max-w-none px-6 py-8 sm:px-10 sm:py-10 text-slate-700"
          )}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            1. Postanowienia ogólne
          </h2>
          <p className="mb-6 leading-relaxed">
            Niniejszy regulamin określa zasady korzystania ze strony
            internetowej Afiliantka Faceless dostępnej pod adresem domeny
            publicznej serwisu. Korzystając ze strony, akceptujesz poniższe
            warunki.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            2. Charakter serwisu
          </h2>
          <p className="mb-6 leading-relaxed">
            Strona publiczna prezentuje informacje o promocjach bankowych i
            artykuły edukacyjne. Nie stanowi oferty w rozumieniu Kodeksu cywilnego
            ani doradztwa finansowego. Szczegóły promocji zawsze należy weryfikować
            u instytucji finansowej.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            3. Linki partnerskie
          </h2>
          <p className="mb-6 leading-relaxed">
            Niektóre odnośniki prowadzą do stron partnerów i mogą generować
            wynagrodzenie dla operatora serwisu. Informacja o charakterze
            partnerskim linków jest prezentowana przy szczegółach ofert.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            4. Odpowiedzialność
          </h2>
          <p className="mb-6 leading-relaxed">
            Operator dokłada starań, aby publikowane informacje były aktualne,
            jednak nie ponosi odpowiedzialności za decyzje podjęte na ich
            podstawie ani za treści serwisów zewnętrznych.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            5. Zmiany regulaminu
          </h2>
          <p className="mb-6 leading-relaxed">
            Operator może wprowadzać zmiany w regulaminie. Aktualna wersja jest
            publikowana na tej stronie.
          </p>

          <p className="text-sm text-slate-500">
            Ostatnia aktualizacja: wrzesień 2026. Treść ma charakter
            informacyjny i może zostać uzupełniona po konsultacji prawnej.
          </p>
        </article>
      </PublicSection>
    </>
  );
}
