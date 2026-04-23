import { client } from "@/sanity/lib/client";
import { ChevronDown } from "lucide-react";

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
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold mb-4 text-center">
          Często zadawane pytania
        </h2>
        <p className="text-slate-500 text-center mb-10 max-w-xl mx-auto">
          Znajdź odpowiedzi na najczęściej zadawane pytania
        </p>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item._id}
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
  );
}
