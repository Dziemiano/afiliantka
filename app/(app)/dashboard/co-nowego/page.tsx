"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ContentReleaseWithSeen } from "@/types/notifications";

const TYPE_LABELS: Record<string, string> = {
  file: "Plik",
  resource: "Zasób",
  offer: "Oferta",
  general: "Ogólne",
};

export default function WhatsNewPage() {
  const [releases, setReleases] = useState<ContentReleaseWithSeen[]>([]);
  const [unseenCount, setUnseenCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/user/whats-new");
    if (res.ok) {
      const data = await res.json();
      setReleases(data.releases);
      setUnseenCount(data.unseen_count);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markSeen = async (releaseId: string) => {
    await fetch("/api/user/whats-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ releaseId }),
    });
    await load();
  };

  const markAllSeen = async () => {
    await fetch("/api/user/whats-new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-brand" aria-hidden="true" />
            Co nowego
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Nowe materiały i aktualizacje na platformie
            {unseenCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand text-white">
                {unseenCount} nowe
              </span>
            )}
          </p>
        </div>
        {unseenCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllSeen}
            className="min-h-[44px]"
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Oznacz wszystkie jako przeczytane
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Ładowanie...</p>
      ) : releases.length === 0 ? (
        <p className="text-sm text-gray-500">
          Brak nowych publikacji. Wróć później!
        </p>
      ) : (
        <ul className="space-y-4">
          {releases.map((release) => (
            <li
              key={release.id}
              className={`border rounded-xl p-4 sm:p-5 transition-colors ${
                release.seen
                  ? "border-gray-200 bg-white"
                  : "border-brand/30 bg-brand-light/30"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {TYPE_LABELS[release.content_type] || release.content_type}
                    </span>
                    {!release.seen && (
                      <span className="text-xs font-medium text-brand">
                        Nowe
                      </span>
                    )}
                    <time
                      dateTime={release.published_at}
                      className="text-xs text-gray-400"
                    >
                      {new Date(release.published_at).toLocaleDateString(
                        "pl-PL",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    {release.title}
                  </h2>
                  {release.description && (
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {release.description}
                    </p>
                  )}
                  {release.section && (
                    <p className="text-xs text-gray-400 mt-2">
                      Sekcja: {release.section}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  {release.link && (
                    <Link
                      href={release.link}
                      onClick={() => {
                        if (!release.seen) markSeen(release.id);
                      }}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] text-sm font-medium text-brand border border-brand/30 rounded-lg hover:bg-brand-light transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                    >
                      Otwórz
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  )}
                  {!release.seen && (
                    <Button
                      variant="ghost"
                      onClick={() => markSeen(release.id)}
                      className="min-h-[44px] text-sm"
                    >
                      Oznacz jako przeczytane
                    </Button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
