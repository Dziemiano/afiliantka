import { createAdminClient } from "@/lib/supabase/server";
import { notifyAllActiveUsers } from "@/lib/user-notifications";
import type { ContentReleaseType } from "@/types/notifications";

interface PublishContentParams {
  contentType: ContentReleaseType;
  title: string;
  description?: string;
  link?: string;
  section?: string;
  contentId?: string;
  publishedBy: string;
  notifyUsers?: boolean;
  sendEmail?: boolean;
}

export async function publishContentRelease(
  params: PublishContentParams
): Promise<{ id: string | null; notified: number }> {
  const admin = await createAdminClient();

  const { data, error } = await admin
    .from("content_releases")
    .insert({
      content_type: params.contentType,
      content_id: params.contentId || null,
      title: params.title,
      description: params.description || null,
      link: params.link || null,
      section: params.section || null,
      published_by: params.publishedBy,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { id: null, notified: 0 };
  }

  let notified = 0;
  if (params.notifyUsers !== false) {
    notified = await notifyAllActiveUsers({
      type: "new_content",
      title: "Nowa treść: " + params.title,
      message:
        params.description ||
        "Dodano nowe materiały na platformie. Sprawdź sekcję „Co nowego”.",
      link: params.link || "/dashboard/co-nowego",
      sendEmail: params.sendEmail,
    });
  }

  return { id: data.id, notified };
}
