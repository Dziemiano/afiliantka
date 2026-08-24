export type UserNotificationType = "new_content" | "onboarding_status";

export interface UserNotification {
  id: string;
  user_id: string;
  type: UserNotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  email_sent: boolean;
  created_at: string;
}

export type ContentReleaseType = "file" | "resource" | "offer" | "general";

export interface ContentRelease {
  id: string;
  content_type: ContentReleaseType;
  content_id: string | null;
  title: string;
  description: string | null;
  link: string | null;
  section: string | null;
  published_at: string;
  published_by: string | null;
}

export interface ContentReleaseWithSeen extends ContentRelease {
  seen: boolean;
}
