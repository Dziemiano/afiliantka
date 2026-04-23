import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role:roles(name, description)")
    .eq("user_id", user.id);

  const roles = (roleData || [])
    .map((item) => item.role as unknown as { name: string; description: string })
    .filter(Boolean);

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status, created_at, approved_at")
    .eq("user_id", user.id)
    .single();

  const { data: activityData } = await supabase
    .from("user_activity")
    .select("id")
    .eq("user_id", user.id);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      user_metadata: user.user_metadata || {},
    },
    roles,
    onboarding: onboarding || null,
    activity_count: activityData?.length || 0,
  });
}
