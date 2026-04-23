import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  const data = await client.fetch(
    `*[_type == "heroSection"][0]{ title, description }`,
    {},
    { next: { revalidate: 600 } }
  );

  return NextResponse.json({
    title: data?.title || null,
    description: data?.description || null,
  });
}
