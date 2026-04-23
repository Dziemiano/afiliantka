import { createClient } from "@/lib/supabase/server";

export type ActivityAction =
  | "file_download"
  | "file_view"
  | "page_view"
  | "onboarding_step"
  | "offer_selected"
  | "offer_removed"
  | "requirement_completed"
  | "login";

interface LogActivityParams {
  userId: string;
  action: ActivityAction;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  metadata?: Record<string, unknown>;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from("user_activity").insert({
      user_id: params.userId,
      action: params.action,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      resource_name: params.resourceName || null,
      metadata: params.metadata || {},
    });
  } catch {
    // Activity logging should never break the main flow
  }
}
