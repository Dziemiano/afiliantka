import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { selection_id, completed } = (await request.json()) as {
    selection_id: string;
    completed: boolean;
  };

  if (!selection_id) {
    return NextResponse.json({ message: "Missing selection_id" }, { status: 400 });
  }

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", session.user.id)
    .single();

  const allowedStatuses = ["selecting_offers", "completing_requirements", "accounts_verified"];
  if (!onboarding || !allowedStatuses.includes(onboarding.status)) {
    return NextResponse.json(
      { message: "Nieprawidłowy etap onboardingu" },
      { status: 400 }
    );
  }

  const updateData: Record<string, unknown> = {
    requirement_completed: completed,
    completed_at: completed ? new Date().toISOString() : null,
  };
  if (completed) {
    updateData.rejection_reason = null;
    updateData.rejected_at = null;
  }

  const { error } = await supabase
    .from("user_offer_selections")
    .update(updateData)
    .eq("id", selection_id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (completed) {
    logActivity({
      userId: session.user.id,
      action: "requirement_completed",
      resourceType: "offer_selection",
      resourceId: selection_id,
    });
  }

  // Check if all 4 requirements are now completed
  const { data: allSelections } = await supabase
    .from("user_offer_selections")
    .select("requirement_completed")
    .eq("user_id", session.user.id);

  const allDone =
    allSelections &&
    allSelections.length === 4 &&
    allSelections.every((s) => s.requirement_completed);

  if (allDone) {
    await supabase
      .from("user_onboarding")
      .update({
        status: "pending_approval",
        requirements_completed_at: new Date().toISOString(),
      })
      .eq("user_id", session.user.id);

    // Create admin notification
    const userEmail = session.user.email || "Użytkownik";
    await supabase.from("admin_notifications").insert({
      type: "onboarding_complete",
      title: "Onboarding zakończony",
      message: `${userEmail} ukończył(a) wszystkie wymagania onboardingu i czeka na zatwierdzenie.`,
      related_user_id: session.user.id,
    });

    return NextResponse.json({ success: true, all_completed: true });
  }

  return NextResponse.json({ success: true, all_completed: false });
}
