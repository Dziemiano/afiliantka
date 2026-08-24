"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, StatCard } from "@/components/admin/analytics-charts";
import type { AdminAnalyticsSummary } from "@/types/analytics";
import { BarChart3, RefreshCw, MousePointerClick, Eye, BookOpen } from "lucide-react";

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1, 1);
  return date.toLocaleDateString("pl-PL", { month: "short", year: "numeric" });
}

function formatDay(date: string): string {
  return new Date(date).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
  });
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AdminAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/analytics");
      const json = (await res.json()) as AdminAnalyticsSummary & {
        message?: string;
      };
      if (!res.ok) {
        setError(json.message || "Nie udało się pobrać analityki.");
        return;
      }
      setData(json);
    } catch {
      setError("Wystąpił błąd połączenia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-brand" />
            Analityka
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Statystyki strony publicznej i aktywności użytkowników (ostatnie 30
            dni)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={load}
          disabled={loading}
          className="min-h-[44px]"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Odśwież
        </Button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {loading && !data ? (
        <p className="text-sm text-gray-500">Ładowanie danych...</p>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Wyświetlenia stron"
              value={data.totalPageViews}
              hint="Ostatnie 30 dni"
            />
            <StatCard
              label="Kliknięcia w oferty"
              value={data.totalOfferClicks}
              hint="Przez /go/[slug]"
            />
            <StatCard
              label="Odczyty bloga"
              value={data.totalBlogReads}
              hint="Ostatnie 30 dni"
            />
            <StatCard
              label="Pobrania plików"
              value={data.downloadCount}
              hint="Łącznie (panel)"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-4 w-4 text-brand" />
                  Wyświetlenia — ostatnie 14 dni
                </CardTitle>
                <CardDescription>
                  Ruch na stronie publicznej
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  items={data.pageViewsByDay.map((d) => ({
                    label: formatDay(d.date),
                    value: d.count,
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Rejestracje użytkowników
                </CardTitle>
                <CardDescription>Nowi użytkownicy wg miesiąca</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  items={data.signupsByMonth.map((s) => ({
                    label: formatMonth(s.month),
                    value: s.count,
                  }))}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-brand" />
                  Najpopularniejsze oferty
                </CardTitle>
                <CardDescription>
                  Wyświetlenia i kliknięcia afiliacyjne
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.topOffers.length === 0 ? (
                  <p className="text-sm text-gray-500">Brak danych o ofertach.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-gray-500">
                          <th className="py-2 pr-4 font-medium">Oferta</th>
                          <th className="py-2 pr-4 font-medium text-right">
                            Wyśw.
                          </th>
                          <th className="py-2 font-medium text-right">
                            Klik.
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topOffers.map((offer) => (
                          <tr
                            key={offer.slug}
                            className="border-b border-gray-100"
                          >
                            <td className="py-2.5 pr-4 text-gray-800">
                              {offer.name}
                            </td>
                            <td className="py-2.5 pr-4 text-right text-gray-600 tabular-nums">
                              {offer.views}
                            </td>
                            <td className="py-2.5 text-right text-gray-600 tabular-nums">
                              {offer.clicks}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand" />
                  Onboarding
                </CardTitle>
                <CardDescription>
                  Postęp użytkowników w procesie onboardingu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-gray-900">
                      {data.onboarding.total}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Łącznie</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-green-700">
                      {data.onboarding.approved}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Ukończone</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-amber-700">
                      {data.onboarding.inProgress}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">W trakcie</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Wskaźnik ukończenia</span>
                    <span className="font-semibold text-gray-900">
                      {data.onboarding.completionRate}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand rounded-full"
                      style={{
                        width: `${data.onboarding.completionRate}%`,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
