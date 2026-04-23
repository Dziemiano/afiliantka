import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";

export async function AppLogo({ className = "" }: { className?: string }) {
  const data = await client.fetch(
    `*[_type == "heroSection"][0]{ image }`,
    {},
    { next: { revalidate: 600, tags: ["heroSection"] } }
  );
  const logo = data?.image;
  if (!logo) return null;
  return (
    <div
      className={`flex justify-center items-center w-full py-4 bg-gradient-to-br from-brand-light via-white to-teal-50 ${className}`}
    >
      <div className="relative w-full max-w-3xl h-14 sm:h-18 lg:h-20 px-4">
        <Image
          src={urlFor(logo).width(960).height(240).url()}
          alt="Afiliantka Faceless Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
        />
      </div>
    </div>
  );
}
