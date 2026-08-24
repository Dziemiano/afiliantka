import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { logPublicEvent } from "@/lib/public-analytics";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://afiliantkafaceless.pl";

interface GoRouteProps {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: GoRouteProps) {
  const { slug } = await params;

  const offer = await client.fetch<{ title: string; link: string } | null>(
    `*[_type == "offer" && slug.current == $slug][0]{ title, link }`,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!offer?.link) {
    return NextResponse.redirect(`${siteUrl}/oferty`, 302);
  }

  await logPublicEvent({
    eventType: "offer_click",
    resourceType: "offer",
    resourceId: slug,
    resourceName: offer.title,
    metadata: {
      referer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    },
  });

  return NextResponse.redirect(offer.link, 302);
}
