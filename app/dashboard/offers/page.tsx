import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import { Offer } from "@/types/offer";
import { OfferCard } from "@/components/ui/offer-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getOffers(): Promise<Offer[]> {
  const query = `*[_type == "offer"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    description,
    image,
    link,
    featured,
    category,
    files[]{
      _key,
      asset->{
        _ref,
        _type,
        url,
        originalFilename
      }
    },
    slug
  }`;
  return await client.fetch(
    query,
    {},
    { next: { revalidate: 300, tags: ["offers"] } }
  );
}

function OffersContent() {
  return (
    <Suspense
      fallback={<div className="text-center py-8">Loading offers...</div>}
    >
      <OffersList />
    </Suspense>
  );
}

async function OffersList() {
  const offers = await getOffers();
  const personalOffers = offers.filter(
    (offer) => offer.category === "personal"
  );
  const businessOffers = offers.filter(
    (offer) => offer.category === "business"
  );
  const creditCardOffers = offers.filter(
    (offer) => offer.category === "credit-cards"
  );

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Personal</p>
              <p className="text-2xl font-bold text-gray-900">
                {personalOffers.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-semibold">👤</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Business</p>
              <p className="text-2xl font-bold text-gray-900">
                {businessOffers.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-semibold">🏢</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Credit Cards</p>
              <p className="text-2xl font-bold text-gray-900">
                {creditCardOffers.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-semibold">💳</span>
            </div>
          </div>
        </div>
      </div>

      {/* All Offers Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Offers
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-gray-600">
              {offers.length} total
            </Badge>
            <Link href="/oferty">
              <Button variant="outline" size="sm">
                View Public Page
              </Button>
            </Link>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No offers available
            </h3>
            <p className="text-gray-600 mb-4">
              There are currently no offers in the system.
            </p>
            <Link href="/oferty">
              <Button variant="outline">Check Public Offers</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <div key={offer._id} className="relative">
                <OfferCard offer={offer} />
                {offer.category && (
                  <div className="absolute top-2 right-2">
                    <Badge
                      className={
                        offer.category === "personal"
                          ? "bg-blue-500 text-white text-xs"
                          : offer.category === "business"
                            ? "bg-green-500 text-white text-xs"
                            : "bg-purple-500 text-white text-xs"
                      }
                    >
                      {offer.category === "personal"
                        ? "Personal"
                        : offer.category === "business"
                          ? "Business"
                          : "Credit Cards"}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OffersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Available Offers
            </h1>
            <p className="text-gray-600">
              Browse all available offers by category
            </p>
          </div>
        </div>
        <p className="text-gray-700">
          View all available offers organized by Personal, Business, and Credit
          Card categories. Click on any offer to see more details. Offers are
          managed by administrators.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link href="/oferty">
          <Button variant="outline" className="flex items-center gap-2">
            <span>🌐</span>
            View Public Offers
          </Button>
        </Link>
        <Link href="/dashboard/files">
          <Button variant="outline" className="flex items-center gap-2">
            <span>📁</span>
            Related Files
          </Button>
        </Link>
        <Link href="/dashboard/onboard">
          <Button variant="outline" className="flex items-center gap-2">
            <span>📚</span>
            Onboarding Materials
          </Button>
        </Link>
      </div>

      {/* Offers Content */}
      <OffersContent />
    </div>
  );
}
