import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-neutral-50/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/60 border-stone-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-stone-700">
            Afiliantka Faceless
          </h1>
          <Badge
            variant="secondary"
            className="bg-stone-100 text-stone-600 border-stone-300"
          >
            Beta
          </Badge>
        </div>
        <nav className="flex gap-6 items-center">
          <Link
            href="/"
            className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
          >
            Oferty
          </Link>
          <Link
            href="/news"
            className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
          >
            News
          </Link>
        </nav>
      </div>
    </header>
  );
}
