import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { client as sanityClient } from "@/sanity/lib/client";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const query = `*[_type == "offer"] | order(featured desc, _createdAt desc) {
    _id,
    title,
    requirement,
    category,
    featured,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }`;

  const offers = await sanityClient.fetch(query, {}, { next: { revalidate: 60 } });

  return NextResponse.json({ offers: offers || [] });
}
