import { headers } from "next/headers";
import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeHostname } from "@/lib/hosts";
import WebsiteLayout from "@/app/(website)/layout";
import { PublicNotFoundContent } from "@/components/layout/public-not-found-content";

const DEFAULT_WEB_HOST = "localhost";

export default async function NotFound() {
  const headersList = await headers();
  const host = normalizeHostname(headersList.get("host") || "");
  const webHost = process.env.WEB_HOST?.trim() || DEFAULT_WEB_HOST;

  if (host === webHost) {
    return (
      <WebsiteLayout>
        <PublicNotFoundContent />
      </WebsiteLayout>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <FileQuestion
          className="h-16 w-16 text-brand mx-auto mb-6"
          aria-hidden="true"
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
          404
        </h1>
        <p className="text-slate-600 text-base sm:text-lg mb-8">
          Nie znaleziono strony, której szukasz.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="min-h-[44px] bg-brand hover:bg-brand-dark">
            <Link href="/">Strona główna</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-[44px]">
            <Link href="/login">Logowanie</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
