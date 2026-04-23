import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_user_admin");

  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  const { count } = await supabase
    .from("admin_notifications")
    .select("*", { count: "exact", head: true })
    .eq("read", false);

  return NextResponse.json({ notifications: data || [], unread_count: count || 0 });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_user_admin");

  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id, read } = (await request.json()) as { id?: string; read: boolean };

  if (id) {
    await supabase
      .from("admin_notifications")
      .update({ read })
      .eq("id", id);
  } else {
    // Mark all as read
    await supabase
      .from("admin_notifications")
      .update({ read: true })
      .eq("read", false);
  }

  return NextResponse.json({ success: true });
}
