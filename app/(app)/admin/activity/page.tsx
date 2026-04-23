"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Activity,
  Download,
  Eye,
  CheckSquare,
  Plus,
  Minus,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ActivityEntry {
  id: string;
  user_id: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  resource_name: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

const ACTION_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  file_download: {
    label: "Pobranie pliku",
    icon: <Download className="h-4 w-4" />,
    color: "text-blue-600 bg-blue-50",
  },
  file_view: {
    label: "Podgląd pliku",
    icon: <Eye className="h-4 w-4" />,
    color: "text-green-600 bg-green-50",
  },
  page_view: {
    label: "Odwiedzenie strony",
    icon: <Eye className="h-4 w-4" />,
    color: "text-stone-600 bg-stone-50",
  },
  onboarding_step: {
    label: "Krok onboardingu",
    icon: <Activity className="h-4 w-4" />,
    color: "text-purple-600 bg-purple-50",
  },
  offer_selected: {
    label: "Wybrano ofertę",
    icon: <Plus className="h-4 w-4" />,
    color: "text-emerald-600 bg-emerald-50",
  },
  offer_removed: {
    label: "Usunięto ofertę",
    icon: <Minus className="h-4 w-4" />,
    color: "text-red-600 bg-red-50",
  },
  requirement_completed: {
    label: "Zrealizowano wymaganie",
    icon: <CheckSquare className="h-4 w-4" />,
    color: "text-amber-600 bg-amber-50",
  },
  login: {
    label: "Logowanie",
    icon: <Activity className="h-4 w-4" />,
    color: "text-indigo-600 bg-indigo-50",
  },
};

const PAGE_SIZE = 50;

export default function AdminActivityPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchActivities = useCallback(async (pageNum: number) => {
    setLoading(true);
    const offset = pageNum * PAGE_SIZE;
    const res = await fetch(
      `/api/admin/activity?limit=${PAGE_SIZE}&offset=${offset}`
    );
    if (res.ok) {
      const data = await res.json();
      setActivities(data.activities || []);
      setHasMore((data.activities || []).length === PAGE_SIZE);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchActivities(page);
  }, [page, fetchActivities]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
          Log aktywności
        </h1>
        <p className="text-sm text-stone-500">
          Historia akcji użytkowników w aplikacji
        </p>
      </div>

      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-stone-400" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-16 text-stone-500">
            Brak zarejestrowanych akcji.
          </div>
        ) : (
          <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-stone-50 text-stone-600">
                  <th className="text-left px-4 py-3 font-medium">Akcja</th>
                  <th className="text-left px-4 py-3 font-medium">Zasób</th>
                  <th className="text-left px-4 py-3 font-medium">
                    Użytkownik
                  </th>
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => {
                  const cfg = ACTION_CONFIG[a.action] || {
                    label: a.action,
                    icon: <Activity className="h-4 w-4" />,
                    color: "text-stone-600 bg-stone-50",
                  };
                  return (
                    <tr
                      key={a.id}
                      className="border-b last:border-b-0 hover:bg-stone-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-md ${cfg.color}`}
                          >
                            {cfg.icon}
                          </span>
                          <span className="font-medium text-stone-800">
                            {cfg.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-stone-600 truncate max-w-[200px]">
                        {a.resource_name || a.resource_id || "—"}
                      </td>
                      <td className="px-4 py-3 text-stone-500 font-mono text-xs truncate max-w-[180px]">
                        {a.user_id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">
                        {new Date(a.created_at).toLocaleString("pl-PL")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="md:hidden divide-y divide-stone-100">
            {activities.map((a) => {
              const cfg = ACTION_CONFIG[a.action] || {
                label: a.action,
                icon: <Activity className="h-4 w-4" />,
                color: "text-stone-600 bg-stone-50",
              };
              return (
                <div key={a.id} className="p-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-md ${cfg.color}`}
                    >
                      {cfg.icon}
                    </span>
                    <span className="font-medium text-sm text-stone-800">
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-sm text-stone-600 truncate pl-9">
                    {a.resource_name || a.resource_id || "—"}
                  </p>
                  <div className="flex items-center justify-between pl-9 text-xs text-stone-500">
                    <span className="font-mono">
                      {a.user_id.slice(0, 8)}...
                    </span>
                    <span>
                      {new Date(a.created_at).toLocaleString("pl-PL")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] text-sm border rounded-md disabled:opacity-40 hover:bg-stone-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Poprzednia</span>
        </button>
        <span className="text-sm text-stone-500">
          Strona {page + 1}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasMore}
          className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] text-sm border rounded-md disabled:opacity-40 hover:bg-stone-50"
        >
          <span className="hidden sm:inline">Następna</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
