import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-200 text-gray-800 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find the Best Affiliate Offers
          </h1>
          <p className="text-xl mb-8">
            Discover exclusive deals and maximize your earnings with our curated
            selection of affiliate offers.
          </p>
        </div>
      </div>
    </section>
  );
}
