import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PublicAnalyticsTracker } from "@/components/analytics/public-analytics-tracker";
import { SkipLink } from "@/components/layout/skip-link";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <SkipLink />
      <PublicAnalyticsTracker />
      <Header />
      <div id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </div>
      <Footer />
    </div>
  );
}
