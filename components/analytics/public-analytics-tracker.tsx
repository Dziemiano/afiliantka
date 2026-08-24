"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

function getTrackUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_ORIGIN) {
    return `${process.env.NEXT_PUBLIC_APP_ORIGIN}/api/analytics/track`;
  }
  if (typeof window !== "undefined") {
    const host = window.location.host.replace(/^app\./, "");
    return `${window.location.protocol}//app.${host}/api/analytics/track`;
  }
  return "/api/analytics/track";
}

export function PublicAnalyticsTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  const trackUrl = useMemo(() => getTrackUrl(), []);

  useEffect(() => {
    if (!pathname || lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    let eventType: "page_view" | "blog_read" = "page_view";
    let resourceType = "page";
    let resourceId = pathname;
    let resourceName: string | undefined;

    const offerMatch = pathname.match(/^\/oferta\/([^/]+)$/);
    const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);

    if (offerMatch) {
      resourceType = "offer";
      resourceId = offerMatch[1];
    } else if (blogMatch) {
      eventType = "blog_read";
      resourceType = "blog";
      resourceId = blogMatch[1];
    } else {
      resourceName = pathname;
    }

    const payload = JSON.stringify({
      eventType,
      resourceType,
      resourceId,
      resourceName,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        trackUrl,
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch(trackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => undefined);
    }
  }, [pathname, trackUrl]);

  return null;
}
