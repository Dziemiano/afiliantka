export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/sections/hero-section";

export default function Home() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col ">
        {/* Info Section Below Banner */}
        {/* <section className="py-8 px-4 sm:px-8 lg:px-32 xl:px-64">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-stone-700 text-xl font-bold mb-2">
              Witamy w Afiliantka!
            </h2>
            <p className="text-stone-600 text-base sm:text-lg">
              To miejsce, gdzie znajdziesz najlepsze oferty afiliacyjne. Dołącz
              do naszej społeczności i zacznij zarabiać już dziś!
            </p>
          </div>
        </section> */}
        {/* Mobile-Optimized Footer */}
        <HeroSection />
        <footer className="flex flex-col gap-4 px-4 py-6 text-center bg-gradient-to-br from-stone-100 via-neutral-50 to-amber-50">
          <p className="text-stone-500 text-xs sm:text-sm font-normal leading-normal">
            @2025 Afiliantka Faceless. Wszelkie prawa zastrzeżone.
          </p>
        </footer>
      </div>
    </div>
  );
}
