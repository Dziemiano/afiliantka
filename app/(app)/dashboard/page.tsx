import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 sm:p-6 border border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg sm:text-xl">A</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Witaj w Afiliantka
            </h1>
            <p className="text-sm text-gray-600">
              Twój panel do zarządzania materiałami i zasobami
            </p>
          </div>
        </div>
        <p className="text-sm sm:text-base text-gray-700">
          Użyj menu bocznego, aby nawigować między sekcjami. Masz dostęp do
          materiałów, zasobów i plików.
        </p>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/co-nowego"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow h-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-teal-600 font-semibold" aria-hidden="true">
                  ✨
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Co nowego</h3>
                <p className="text-sm text-gray-600">Nowe materiały i aktualizacje</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/onboard"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-semibold">📚</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Materiały</h3>
                <p className="text-sm text-gray-600">Materiały na start</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/resources"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 font-semibold">📖</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Zasoby</h3>
                <p className="text-sm text-gray-600">Poradniki i tutoriale</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/files"
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold">📁</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Pliki</h3>
                <p className="text-sm text-gray-600">Wszystkie pliki</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
