import type { Metadata } from "next";
import { PublicPageHero } from "@/components/layout/public-page-hero";
import { PublicSection } from "@/components/layout/public-section";
import { publicSolidContent } from "@/lib/public-surfaces";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu Afiliantka Faceless — informacje o przetwarzaniu danych osobowych.",
};

export default function PolitykaPrywatnosciPage() {
  return (
    <>
      <PublicPageHero
        title="Polityka prywatności"
        subtitle="Informacje o przetwarzaniu danych osobowych w serwisie Afiliantka Faceless."
      />
      <PublicSection maxWidth="3xl" className="pt-0 pb-16 sm:pb-20">
        <article
          className={publicSolidContent(
            "prose prose-slate max-w-none px-6 py-8 sm:px-10 sm:py-10 text-slate-700"
          )}
        >
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            1. Administrator danych
          </h2>
          <p className="mb-6 leading-relaxed">
            Administratorem danych osobowych przetwarzanych w związku z
            korzystaniem ze strony publicznej Afiliantka Faceless jest operator
            serwisu. W sprawach związanych z ochroną danych można skontaktować
            się pod adresem e-mail wskazanym na stronie współpracy.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            2. Zakres przetwarzanych danych
          </h2>
          <p className="mb-6 leading-relaxed">
            W ramach korzystania ze strony publicznej możemy przetwarzać dane
            techniczne (adres IP, identyfikatory cookies, informacje o
            przeglądarce) oraz dane podane dobrowolnie, np. adres e-mail przy
            zapisie do newslettera.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            3. Cele i podstawy przetwarzania
          </h2>
          <p className="mb-6 leading-relaxed">
            Dane przetwarzamy w celu świadczenia usług drogą elektroniczną,
            analizy ruchu na stronie, obsługi newslettera oraz zapewnienia
            bezpieczeństwa serwisu — na podstawie prawnie uzasadnionego
            interesu administratora lub zgody użytkownika, gdy jest wymagana.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            4. Odbiorcy danych
          </h2>
          <p className="mb-6 leading-relaxed">
            Dane mogą być przekazywane podmiotom wspierającym nas technicznie
            (hosting, analityka, CMS, newsletter), wyłącznie w zakresie
            niezbędnym do realizacji wskazanych celów i przy zachowaniu
            odpowiednich zabezpieczeń.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mb-3">
            5. Prawa użytkownika
          </h2>
          <p className="mb-6 leading-relaxed">
            Przysługuje Ci prawo dostępu do danych, sprostowania, usunięcia,
            ograniczenia przetwarzania, sprzeciwu oraz przenoszenia danych, a
            także prawo wniesienia skargi do organu nadzorczego.
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
