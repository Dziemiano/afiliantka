import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], preload: false, display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantka.pl";

export const metadata: Metadata = {
  title: {
    default: "Afiliantka Faceless — Aktualne oferty bankowe",
    template: "%s | Afiliantka Faceless",
  },
  description:
    "Sprawdź aktualne promocje kont i kart. Porównaj oferty i skorzystaj z bonusów za założenie konta.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Afiliantka Faceless — Aktualne oferty bankowe",
    description:
      "Sprawdź aktualne promocje kont i kart z bonusem za założenie.",
    siteName: "Afiliantka Faceless",
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Afiliantka Faceless",
    description:
      "Sprawdź aktualne promocje kont i kart z bonusem za założenie.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Afiliantka Faceless",
    url: siteUrl,
    description:
      "Aktualne promocje bankowe — konta i karty z bonusem za założenie.",
  };

  return (
    <html lang="pl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
