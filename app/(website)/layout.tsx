import { Suspense } from "react";
import { AppLogo } from "@/components/app-logo";
import { Header } from "@/components/layout/header";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-stone-100 via-neutral-50 to-amber-50 min-h-screen">
      <Header />
      <Suspense fallback={null}>
        <AppLogo />
      </Suspense>
      {children}
    </div>
  );
}
