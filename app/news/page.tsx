import { client } from "@/sanity/lib/client";
import Image from "next/image";
import { urlFor } from "@/lib/sanity-image";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image?: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  date: string;
  author?: string;
}

async function getNews(): Promise<NewsItem[]> {
  const query = `*[_type == "news"] | order(date desc) {
    _id,
    title,
    content,
    image,
    date,
    author
  }`;
  return await client.fetch(query);
}

export default async function NewsPage() {
  const news = await getNews();
  if (news.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-stone-800">Aktualności</h1>
        <p className="text-stone-500">Brak aktualności.</p>
      </div>
    );
  }

  const [featured, ...rest] = news;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-stone-800">Aktualności</h1>
      {/* Featured News */}
      <section className="mb-12">
        <article className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
          {featured.image?.asset && (
            <div className="relative w-full h-64 mb-6 rounded overflow-hidden bg-stone-100">
              <Image
                src={urlFor(featured.image).width(900).height(300).url()}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 900px) 100vw, 900px"
                priority
              />
            </div>
          )}
          <h2 className="text-2xl font-bold text-stone-800 mb-2">
            {featured.title}
          </h2>
          <div className="flex items-center text-xs text-stone-400 mb-4 gap-2">
            <span>{new Date(featured.date).toLocaleDateString("pl-PL")}</span>
            {featured.author && <span>• {featured.author}</span>}
          </div>
          <p className="text-stone-700 whitespace-pre-line text-lg">
            {featured.content}
          </p>
        </article>
      </section>

      {/* Other News */}
      {rest.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-stone-700 mb-6">
            Pozostałe aktualności
          </h3>
          <div className="space-y-8">
            {rest.map((item) => (
              <article
                key={item._id}
                className="bg-white rounded-lg shadow p-4 border border-stone-200 flex gap-4"
              >
                {item.image?.asset && (
                  <div className="relative w-32 h-24 flex-shrink-0 rounded overflow-hidden bg-stone-100">
                    <Image
                      src={urlFor(item.image).width(256).height(96).url()}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-stone-800 mb-1">
                    {item.title}
                  </h4>
                  <div className="flex items-center text-xs text-stone-400 mb-2 gap-2">
                    <span>
                      {new Date(item.date).toLocaleDateString("pl-PL")}
                    </span>
                    {item.author && <span>• {item.author}</span>}
                  </div>
                  <p className="text-stone-700 line-clamp-3">{item.content}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
