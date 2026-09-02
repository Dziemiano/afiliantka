import { client } from "@/sanity/lib/client";
import { ChevronDown, CircleHelp } from "lucide-react";

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

async function getFaqItems(): Promise<FaqItem[]> {
  return await client.fetch(
    `*[_type == "faq"] | order(order asc) { _id, question, answer, order }`,
    {},
    { next: { revalidate: 600, tags: ["faq"] } }
  );
}

export async function FaqSection() {
  const items = await getFaqItems();
  if (items.length === 0) return null;

  return (
    <section
      data-home-section="faq"
      className="bg-transparent py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/45 bg-white/45 p-6 sm:p-8 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <h2 className="text-slate-950 text-2xl sm:text-3xl font-bold mb-4 text-center">
          Często zadawane pytania
        </h2>
        <p className="text-slate-700 text-center mb-10 max-w-xl mx-auto">
          Znajdź odpowiedzi na najczęściej zadawane pytania
        </p>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item._id}
              className="group rounded-2xl border border-white/45 bg-white/45 shadow-[0_8px_32px_rgba(15,23,42,0.12)] backdrop-blur-xl overflow-hidden transition-all duration-200 hover:border-white/70 hover:bg-white/60 hover:shadow-xl"
            >
              <summary className="flex items-center justify-between gap-4 px-5 sm:px-6 py-5 cursor-pointer text-slate-900 font-medium text-sm sm:text-base min-h-[44px] list-none [&::-webkit-details-marker]:hidden select-none">
                <span className="flex items-center gap-3 text-left">
                  <CircleHelp
                    className="h-5 w-5 text-brand flex-shrink-0"
                    aria-hidden="true"
                  />
                  {item.question}
                </span>
                <ChevronDown className="h-5 w-5 text-slate-500 flex-shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <div className="grid grid-rows-[0fr] group-open:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                <div className="overflow-hidden">
                  <div className="px-5 sm:px-6 pb-5 pt-0 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line border-t border-white/45">
                    <div className="pt-4 pl-8">{item.answer}</div>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
