"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Megaphone, Send } from "lucide-react";
import type { ContentRelease, ContentReleaseType } from "@/types/notifications";

const CONTENT_TYPES: { value: ContentReleaseType; label: string }[] = [
  { value: "general", label: "Ogólne" },
  { value: "file", label: "Plik" },
  { value: "resource", label: "Zasób" },
  { value: "offer", label: "Oferta" },
];

export default function AdminContentPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] =
    useState<ContentReleaseType>("general");
  const [link, setLink] = useState("");
  const [section, setSection] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [releases, setReleases] = useState<ContentRelease[]>([]);

  const loadReleases = async () => {
    const res = await fetch("/api/admin/content-releases");
    if (res.ok) {
      const data = await res.json();
      setReleases(data.releases || []);
    }
  };

  useEffect(() => {
    loadReleases();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/content-releases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        contentType,
        link: link || undefined,
        section: section || undefined,
        sendEmail,
      }),
    });

    const data = (await res.json()) as { message?: string };

    if (!res.ok) {
      setError(data.message || "Nie udało się opublikować.");
      setLoading(false);
      return;
    }

    setMessage(data.message || "Opublikowano.");
    setTitle("");
    setDescription("");
    setLink("");
    setSection("");
    setSendEmail(false);
    await loadReleases();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone className="h-6 w-6 text-brand" />
          Publikacja treści
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Ogłoś nowe materiały — użytkownicy zobaczą je w „Co nowego” i
          otrzymają powiadomienie
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Nowa publikacja</CardTitle>
          <CardDescription>
            Treść pojawi się na liście „Co nowego” w panelu użytkownika
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePublish} className="space-y-4">
            <div>
              <label
                htmlFor="content-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Typ treści
              </label>
              <select
                id="content-type"
                value={contentType}
                onChange={(e) =>
                  setContentType(e.target.value as ContentReleaseType)
                }
                className="w-full min-h-[44px] px-3 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tytuł *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="np. Nowe materiały promocyjne"
                className="min-h-[44px]"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Opis
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Krótki opis nowości..."
                className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="link"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Link (opcjonalnie)
                </label>
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="/dashboard/files"
                  className="min-h-[44px]"
                />
              </div>
              <div>
                <label
                  htmlFor="section"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sekcja (opcjonalnie)
                </label>
                <Input
                  id="section"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="resources, onboard..."
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
              <input
                type="checkbox"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
              />
              <span className="text-sm text-gray-700">
                Wyślij również email (wymaga RESEND_API_KEY)
              </span>
            </label>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="min-h-[44px] bg-brand hover:bg-brand-dark text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {loading ? "Publikowanie..." : "Opublikuj i powiadom"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {releases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ostatnie publikacje</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {releases.map((r) => (
                <li
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {r.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(r.published_at).toLocaleString("pl-PL")}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{r.content_type}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
