import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ContentReleaseWithSeen } from "@/types/notifications";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: releases, error } = await supabase
    .from("content_releases")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { data: seenRows } = await supabase
    .from("user_content_seen")
    .select("content_release_id")
    .eq("user_id", user.id);

  const seenIds = new Set(
    (seenRows || []).map((r) => r.content_release_id as string)
  );

  const withSeen: ContentReleaseWithSeen[] = (releases || []).map((r) => ({
    ...r,
    seen: seenIds.has(r.id),
  }));

  const unseenCount = withSeen.filter((r) => !r.seen).length;

  return NextResponse.json({ releases: withSeen, unseen_count: unseenCount });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    releaseId?: string;
    markAll?: boolean;
  };

  if (body.markAll) {
    const { data: allReleases } = await supabase
      .from("content_releases")
      .select("id");

    if (allReleases && allReleases.length > 0) {
      await supabase.from("user_content_seen").upsert(
        allReleases.map((r) => ({
          user_id: user.id,
          content_release_id: r.id,
        })),
        { onConflict: "user_id,content_release_id" }
      );
    }

    return NextResponse.json({ success: true });
  }

  if (!body.releaseId) {
    return NextResponse.json(
      { message: "Brak identyfikatora publikacji." },
      { status: 400 }
    );
  }

  await supabase.from("user_content_seen").upsert(
    {
      user_id: user.id,
      content_release_id: body.releaseId,
    },
    { onConflict: "user_id,content_release_id" }
  );

  return NextResponse.json({ success: true });
}
