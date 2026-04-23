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

  const { data } = await supabase
    .from("user_roles")
    .select("role:roles(name)")
    .eq("user_id", session.user.id);

  const roleNames = (data || [])
    .map((item) => (item.role as unknown as { name: string })?.name)
    .filter(Boolean);

  return NextResponse.json({ roles: roleNames });
}
