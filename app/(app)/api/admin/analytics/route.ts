import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type {
  AdminAnalyticsSummary,
  AnalyticsOfferStats,
  AnalyticsPageViewPoint,
  AnalyticsSignupPoint,
} from "@/types/analytics";

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function lastNMonths(n: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }
  return months;
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(dateKey(d));
  }
  return days;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: isAdmin } = await supabase.rpc("is_user_admin");
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const admin = await createAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    eventsResult,
    downloadsResult,
    onboardingResult,
    usersResult,
  ] = await Promise.all([
    admin
      .from("public_analytics_events")
      .select("event_type, resource_type, resource_id, resource_name, created_at")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    admin
      .from("user_activity")
      .select("id", { count: "exact", head: true })
      .eq("action", "file_download"),
    admin.from("user_onboarding").select("status"),
    admin.auth.admin.listUsers({ perPage: 1000 }),
  ]);

  const events = eventsResult.data || [];
  const onboardingRows = onboardingResult.data || [];
  const users = usersResult.data?.users || [];

  const signupMonths = lastNMonths(6);
  const signupsByMonthMap = new Map<string, number>(
    signupMonths.map((m) => [m, 0])
  );

  for (const u of users) {
    if (!u.created_at) continue;
    const key = monthKey(new Date(u.created_at));
    if (signupsByMonthMap.has(key)) {
      signupsByMonthMap.set(key, (signupsByMonthMap.get(key) || 0) + 1);
    }
  }

  const signupsByMonth: AnalyticsSignupPoint[] = signupMonths.map((month) => ({
    month,
    count: signupsByMonthMap.get(month) || 0,
  }));

  const dayKeys = lastNDays(14);
  const pageViewsByDayMap = new Map<string, number>(
    dayKeys.map((d) => [d, 0])
  );

  let totalPageViews = 0;
  let totalOfferClicks = 0;
  let totalBlogReads = 0;

  const offerStatsMap = new Map<
    string,
    { name: string; views: number; clicks: number }
  >();

  for (const event of events) {
    const day = dateKey(new Date(event.created_at));

    if (event.event_type === "page_view") {
      totalPageViews++;
      if (pageViewsByDayMap.has(day)) {
        pageViewsByDayMap.set(day, (pageViewsByDayMap.get(day) || 0) + 1);
      }
      if (event.resource_type === "offer" && event.resource_id) {
        const existing = offerStatsMap.get(event.resource_id) || {
          name: event.resource_name || event.resource_id,
          views: 0,
          clicks: 0,
        };
        existing.views++;
        if (event.resource_name) existing.name = event.resource_name;
        offerStatsMap.set(event.resource_id, existing);
      }
    }

    if (event.event_type === "offer_click" && event.resource_id) {
      totalOfferClicks++;
      const existing = offerStatsMap.get(event.resource_id) || {
        name: event.resource_name || event.resource_id,
        views: 0,
        clicks: 0,
      };
      existing.clicks++;
      if (event.resource_name) existing.name = event.resource_name;
      offerStatsMap.set(event.resource_id, existing);
    }

    if (event.event_type === "blog_read") {
      totalBlogReads++;
    }
  }

  const pageViewsByDay: AnalyticsPageViewPoint[] = dayKeys.map((date) => ({
    date,
    count: pageViewsByDayMap.get(date) || 0,
  }));

  const topOffers: AnalyticsOfferStats[] = Array.from(offerStatsMap.entries())
    .map(([slug, stats]) => ({
      slug,
      name: stats.name,
      views: stats.views,
      clicks: stats.clicks,
    }))
    .sort((a, b) => b.clicks + b.views - (a.clicks + a.views))
    .slice(0, 10);

  const totalOnboarding = onboardingRows.length;
  const approved = onboardingRows.filter((r) => r.status === "approved").length;
  const inProgress = totalOnboarding - approved;

  const summary: AdminAnalyticsSummary = {
    signupsByMonth,
    topOffers,
    downloadCount: downloadsResult.count || 0,
    onboarding: {
      total: totalOnboarding,
      approved,
      inProgress,
      completionRate:
        totalOnboarding > 0
          ? Math.round((approved / totalOnboarding) * 100)
          : 0,
    },
    pageViewsByDay,
    totalPageViews,
    totalOfferClicks,
    totalBlogReads,
  };

  return NextResponse.json(summary);
}
