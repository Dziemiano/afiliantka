import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PublicAnalyticsTracker } from "@/components/analytics/public-analytics-tracker";
import { SkipLink } from "@/components/layout/skip-link";
import { PublicShaderBackground } from "@/components/layout/public-shader-background";
import { getSiteSettings } from "@/lib/site-settings";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="relative isolate min-h-screen overflow-x-clip">
      <PublicShaderBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <SkipLink />
        <PublicAnalyticsTracker />
        <Header
          showBlog={settings.showBlog}
          showLogin={settings.showLogin}
          logo={settings.logo}
        />
        <div
          id="main-content"
          tabIndex={-1}
          className="flex-1 outline-none"
        >
          {children}
        </div>
        <Footer
          showBlog={settings.showBlog}
          instagramUrl={settings.instagramUrl}
          facebookUrl={settings.facebookUrl}
          tiktokUrl={settings.tiktokUrl}
        />
      </div>
    </div>
  );
}
