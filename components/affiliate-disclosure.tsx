import { Info } from "lucide-react";

export function AffiliateDisclosure() {
  return (
    <aside
      className="mt-8 p-4 sm:p-5 bg-slate-50 border border-slate-200 rounded-xl"
      role="note"
      aria-label="Informacja o linkach partnerskich"
    >
      <div className="flex gap-3">
        <Info className="h-5 w-5 text-slate-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-slate-600 leading-relaxed">
          <strong className="text-slate-700 font-medium">
            Informacja o linkach partnerskich:
          </strong>{" "}
          Linki na tej stronie są linkami afiliacyjnymi. Oznacza to, że możemy
          otrzymać prowizję, jeśli skorzystasz z oferty — bez dodatkowych
          kosztów dla Ciebie. Promujemy wyłącznie oferty, które uważamy za
          wartościowe.
        </p>
      </div>
    </aside>
  );
}
