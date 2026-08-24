export type PublicEventType = "page_view" | "offer_click" | "blog_read";

export interface PublicAnalyticsEvent {
  id: string;
  event_type: PublicEventType;
  resource_type: string | null;
  resource_id: string | null;
  resource_name: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface AnalyticsSignupPoint {
  month: string;
  count: number;
}

export interface AnalyticsOfferStats {
  slug: string;
  name: string;
  views: number;
  clicks: number;
}

export interface AnalyticsPageViewPoint {
  date: string;
  count: number;
}

export interface AnalyticsOnboardingStats {
  total: number;
  approved: number;
  inProgress: number;
  completionRate: number;
}

export interface AdminAnalyticsSummary {
  signupsByMonth: AnalyticsSignupPoint[];
  topOffers: AnalyticsOfferStats[];
  downloadCount: number;
  onboarding: AnalyticsOnboardingStats;
  pageViewsByDay: AnalyticsPageViewPoint[];
  totalPageViews: number;
  totalOfferClicks: number;
  totalBlogReads: number;
}
