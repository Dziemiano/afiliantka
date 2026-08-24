import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";
import { Quote } from "lucide-react";

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role?: string;
  image?: {
    asset: { _ref: string; _type: string };
  };
  order: number;
}

async function getTestimonials(): Promise<Testimonial[]> {
  return await client.fetch(
    `*[_type == "testimonial"] | order(order asc) {
      _id, quote, author, role, image, order
    }`,
    {},
    { next: { revalidate: 600, tags: ["testimonial"] } }
  );
}

export async function TestimonialsSection() {
  const items = await getTestimonials();
  if (items.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold mb-4 text-center">
          Co mówią współpracownicy
        </h2>
        <p className="text-slate-500 text-center mb-10 sm:mb-12 max-w-xl mx-auto">
          Opinie osób korzystających z platformy Afiliantka Faceless
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <figure
              key={item._id}
              className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col h-full"
            >
              <Quote
                className="h-8 w-8 text-brand/30 mb-4 flex-shrink-0"
                aria-hidden="true"
              />
              <blockquote className="text-slate-700 text-sm sm:text-base leading-relaxed flex-1 mb-5">
                „{item.quote}"
              </blockquote>
              <figcaption className="flex items-center gap-3 pt-4 border-t border-slate-200">
                {item.image?.asset && (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                    <Image
                      src={urlFor(item.image).width(80).height(80).url()}
                      alt={item.author}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    {item.author}
                  </p>
                  {item.role && (
                    <p className="text-xs text-slate-500">{item.role}</p>
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
