import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { notifyUser } from "@/lib/user-notifications";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_user_admin");

  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const {
    data: { user: adminUser },
  } = await supabase.auth.getUser();

  const { user_id } = (await request.json()) as { user_id: string };

  if (!user_id) {
    return NextResponse.json({ message: "Missing user_id" }, { status: 400 });
  }

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", user_id)
    .single();

  if (!onboarding || onboarding.status !== "pending_approval") {
    return NextResponse.json(
      { message: "Użytkownik nie czeka na zatwierdzenie" },
      { status: 400 }
    );
  }

  // Mark onboarding as approved
  await supabase
    .from("user_onboarding")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
      approved_by: adminUser?.id,
    })
    .eq("user_id", user_id);

  // Remove 'onboard' role, add 'user' role
  const adminSupabase = await createAdminClient();

  const { data: onboardRole } = await adminSupabase
    .from("roles")
    .select("id")
    .eq("name", "onboard")
    .single();

  const { data: userRole } = await adminSupabase
    .from("roles")
    .select("id")
    .eq("name", "user")
    .single();

  if (onboardRole) {
    await adminSupabase
      .from("user_roles")
      .delete()
      .eq("user_id", user_id)
      .eq("role_id", onboardRole.id);
  }

  if (userRole) {
    await adminSupabase
      .from("user_roles")
      .upsert(
        { user_id, role_id: userRole.id, assigned_by: adminUser?.id },
        { onConflict: "user_id,role_id" }
      );
  }

  const { data: approvedUser } = await adminSupabase.auth.admin.getUserById(
    user_id
  );

  await notifyUser({
    userId: user_id,
    email: approvedUser?.user?.email,
    type: "onboarding_status",
    title: "Onboarding zatwierdzony!",
    message:
      "Gratulacje! Administrator zatwierdził Twój onboarding. Masz teraz pełny dostęp do materiałów platformy.",
    link: "/dashboard",
  });

  return NextResponse.json({ success: true });
}
