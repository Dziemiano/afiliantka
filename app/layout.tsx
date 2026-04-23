import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"], preload: false, display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantka.pl";

export const metadata: Metadata = {
  title: {
    default: "Afiliantka Faceless - Sprawdzone Oferty Partnerskie",
    template: "%s | Afiliantka Faceless",
  },
  description:
    "Odkryj starannie wyselekcjonowane oferty partnerskie z wysokimi współczynnikami konwersji. Profesjonalne rozwiązania dla Twojego biznesu online.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Afiliantka Faceless - Sprawdzone Oferty Partnerskie",
    description:
      "Odkryj starannie wyselekcjonowane oferty partnerskie z wysokimi współczynnikami konwersji.",
    siteName: "Afiliantka Faceless",
    type: "website",
    locale: "pl_PL",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Afiliantka Faceless",
    description:
      "Odkryj starannie wyselekcjonowane oferty partnerskie z wysokimi współczynnikami konwersji.",
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
      "Profesjonalne rozwiązania dla Twojego biznesu online. Sprawdzone oferty partnerskie.",
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
