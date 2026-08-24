"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { NewsletterSubscriber } from "@/types/newsletter";
import { Download, Mail, RefreshCw } from "lucide-react";

function toCsv(subscribers: NewsletterSubscriber[]): string {
  const header = "email,source,subscribed_at";
  const rows = subscribers.map((s) =>
    [s.email, s.source ?? "", s.subscribed_at]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [header, ...rows].join("\n");
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/newsletter");
      const data = (await res.json()) as {
        subscribers?: NewsletterSubscriber[];
        message?: string;
      };
      if (!res.ok) {
        setError(data.message || "Nie udało się pobrać subskrybentów.");
        return;
      }
      setSubscribers(data.subscribers || []);
    } catch {
      setError("Wystąpił błąd połączenia.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, []);

  const handleExport = () => {
    const csv = toCsv(subscribers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Newsletter
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Lista subskrybentów ze strony publicznej
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={loadSubscribers}
            disabled={loading}
            className="min-h-[44px]"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Odśwież
          </Button>
          <Button
            onClick={handleExport}
            disabled={subscribers.length === 0}
            className="min-h-[44px] bg-brand hover:bg-brand-dark text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Eksportuj CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Subskrybenci ({subscribers.length})
          </CardTitle>
          <CardDescription>
            Adresy email zapisane przez formularz na stronie głównej i blogu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {loading ? (
            <p className="text-sm text-gray-500">Ładowanie...</p>
          ) : subscribers.length === 0 ? (
            <p className="text-sm text-gray-500">Brak subskrybentów.</p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-gray-500">
                      <th className="py-3 pr-4 font-medium">Email</th>
                      <th className="py-3 pr-4 font-medium">Źródło</th>
                      <th className="py-3 font-medium">Data zapisu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub) => (
                      <tr key={sub.id} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-gray-900">{sub.email}</td>
                        <td className="py-3 pr-4 text-gray-600">
                          {sub.source || "—"}
                        </td>
                        <td className="py-3 text-gray-600">
                          {new Date(sub.subscribed_at).toLocaleString("pl-PL")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-3">
                {subscribers.map((sub) => (
                  <div
                    key={sub.id}
                    className="border border-gray-200 rounded-lg p-4 space-y-1"
                  >
                    <p className="font-medium text-gray-900 break-all">
                      {sub.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {sub.source || "brak źródła"} •{" "}
                      {new Date(sub.subscribed_at).toLocaleString("pl-PL")}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
