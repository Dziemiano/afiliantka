import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15Z" />
    </svg>
  );
}

const LEGAL_LINKS = [
  { href: "#", label: "Polityka prywatności" },
  { href: "#", label: "Regulamin" },
];

interface FooterProps {
  showBlog?: boolean;
  instagramUrl?: string | null;
  facebookUrl?: string | null;
  tiktokUrl?: string | null;
}

export function Footer({
  showBlog = true,
  instagramUrl = null,
  facebookUrl = null,
  tiktokUrl = null,
}: FooterProps) {
  const navLinks = [
    { href: "/", label: "Strona główna" },
    { href: "/oferty", label: "Oferty" },
    ...(showBlog ? [{ href: "/blog", label: "Blog" }] : []),
    { href: "/wspolpraca", label: "Współpraca" },
  ];

  const socialLinks = [
    ...(instagramUrl
      ? [{ href: instagramUrl, label: "Instagram", icon: Instagram }]
      : []),
    ...(facebookUrl
      ? [{ href: facebookUrl, label: "Facebook", icon: Facebook }]
      : []),
    ...(tiktokUrl
      ? [{ href: tiktokUrl, label: "TikTok", icon: TikTokIcon }]
      : []),
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-white">
              Afiliantka
              <span className="text-brand font-normal ml-1">Faceless</span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xs">
              Aktualne promocje bankowe — konta i karty z bonusem za założenie.
              Wybierz ofertę dopasowaną do siebie.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Nawigacja
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors inline-flex min-h-[44px] items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Informacje
            </h3>
            <ul className="space-y-3">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors inline-flex min-h-[44px] items-center"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {socialLinks.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Social media
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-slate-500 text-center">
            &copy; {new Date().getFullYear()} Afiliantka Faceless. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
}
