import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publishContentRelease } from "@/lib/content-releases";
import type { ContentReleaseType } from "@/types/notifications";

export async function GET() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_user_admin");

  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("content_releases")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(30);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ releases: data || [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_user_admin");

  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: {
    contentType?: ContentReleaseType;
    title?: string;
    description?: string;
    link?: string;
    section?: string;
    contentId?: string;
    notifyUsers?: boolean;
    sendEmail?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Nieprawidłowe dane wejściowe." },
      { status: 400 }
    );
  }

  if (!body.title?.trim()) {
    return NextResponse.json(
      { message: "Tytuł jest wymagany." },
      { status: 400 }
    );
  }

  const result = await publishContentRelease({
    contentType: body.contentType || "general",
    title: body.title.trim(),
    description: body.description?.trim(),
    link: body.link?.trim(),
    section: body.section?.trim(),
    contentId: body.contentId?.trim(),
    publishedBy: user.id,
    notifyUsers: body.notifyUsers !== false,
    sendEmail: body.sendEmail === true,
  });

  if (!result.id) {
    return NextResponse.json(
      { message: "Nie udało się opublikować treści." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    id: result.id,
    notified: result.notified,
    message: `Opublikowano. Powiadomiono ${result.notified} użytkowników.`,
  });
}
