// components/AppLogo.tsx
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity-image";
import Image from "next/image";

export async function AppLogo({ className = "" }: { className?: string }) {
  const data = await client.fetch(`*[_type == "heroSection"][0]{ image }`);
  const logo = data?.image;
  if (!logo) return null;
  return (
    <div
      className={`flex justify-center items-center w-full py-6 ${className}`}
      style={{ minHeight: "96px" }}
    >
      <div className="relative w-full h-32 sm:h-40 lg:h-48">
        <Image
          src={urlFor(logo).width(1200).height(300).url()}
          alt="Afiliantka Faceless Logo"
          fill
          className="object-contain"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 960px"
        />
      </div>
    </div>
  );
}
