// components/sections/hero-section.tsx
export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-stone-200 via-neutral-150 to-amber-100 text-gray-800 py-20 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-32 h-32 bg-stone-200/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-amber-100/30 rounded-full blur-xl"></div>

      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 text-stone-700">
          Sprawdzone Oferty Partnerskie
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-stone-600">
          Profesjonalne rozwiązania dla Twojego biznesu online
        </p>
      </div>
    </section>
  );
}
