// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppLogo } from "@/components/app-logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Afiliantka Faceless - Sprawdzone Oferty Partnerskie",
  description: "Profesjonalne rozwiązania dla Twojego biznesu online",
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className={`${inter.className} bg-neutral-50`}>
        <AppLogo />
        {children}
      </body>
    </html>
  );
}
