import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("drive_sources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching drive_sources:", error);
    return NextResponse.json(
      { message: "Failed to fetch drive sources" },
      { status: 500 }
    );
  }

  return NextResponse.json(data || []);
}
