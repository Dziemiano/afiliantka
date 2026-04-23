import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_user_admin");

  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { selection_id, reason } = (await request.json()) as {
    selection_id: string;
    reason: string;
  };

  if (!selection_id || !reason?.trim()) {
    return NextResponse.json(
      { message: "Wymagane: selection_id i reason" },
      { status: 400 }
    );
  }

  // Get the selection to find the user_id
  const { data: selection, error: selError } = await supabase
    .from("user_offer_selections")
    .select("user_id, offer_name")
    .eq("id", selection_id)
    .single();

  if (selError || !selection) {
    return NextResponse.json(
      { message: "Nie znaleziono wyboru oferty" },
      { status: 404 }
    );
  }

  // Mark the selection as rejected and uncomplete
  await supabase
    .from("user_offer_selections")
    .update({
      requirement_completed: false,
      completed_at: null,
      rejection_reason: reason.trim(),
      rejected_at: new Date().toISOString(),
    })
    .eq("id", selection_id);

  // Move user back to completing_requirements if they were pending_approval
  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", selection.user_id)
    .single();

  if (onboarding?.status === "pending_approval") {
    await supabase
      .from("user_onboarding")
      .update({
        status: "completing_requirements",
        requirements_completed_at: null,
      })
      .eq("user_id", selection.user_id);
  }

  return NextResponse.json({ success: true });
}
