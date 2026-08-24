import { NextResponse } from "next/server";
import { logPublicEvent } from "@/lib/public-analytics";
import { withRateLimit } from "@/lib/api-rate-limit";
import type { PublicEventType } from "@/types/analytics";

const ALLOWED_EVENTS: PublicEventType[] = [
  "page_view",
  "blog_read",
];

export async function POST(request: Request) {
  const limited = withRateLimit(request, {
    keyPrefix: "analytics:track",
    limit: 60,
    windowMs: 60_000,
  });
  if (limited) return limited;

  let body: {
    eventType?: string;
    resourceType?: string;
    resourceId?: string;
    resourceName?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Nieprawidłowe dane wejściowe." },
      { status: 400 }
    );
  }

  const eventType = body.eventType as PublicEventType;

  if (!eventType || !ALLOWED_EVENTS.includes(eventType)) {
    return NextResponse.json(
      { message: "Nieobsługiwany typ zdarzenia." },
      { status: 400 }
    );
  }

  if (!body.resourceId?.trim()) {
    return NextResponse.json(
      { message: "Brak identyfikatora zasobu." },
      { status: 400 }
    );
  }

  await logPublicEvent({
    eventType,
    resourceType: body.resourceType,
    resourceId: body.resourceId.trim(),
    resourceName: body.resourceName?.trim(),
    metadata: {
      referer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    },
  });

  return NextResponse.json({ ok: true });
}
