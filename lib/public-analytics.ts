import { createAdminClient } from "@/lib/supabase/server";
import type { PublicEventType } from "@/types/analytics";

interface LogPublicEventParams {
  eventType: PublicEventType;
  resourceType?: string;
  resourceId?: string;
  resourceName?: string;
  metadata?: Record<string, unknown>;
}

export async function logPublicEvent(
  params: LogPublicEventParams
): Promise<void> {
  try {
    const supabase = await createAdminClient();
    await supabase.from("public_analytics_events").insert({
      event_type: params.eventType,
      resource_type: params.resourceType || null,
      resource_id: params.resourceId || null,
      resource_name: params.resourceName || null,
      metadata: params.metadata || {},
    });
  } catch {
    // Analytics must not break user flows
  }
}
