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

  const { selection_id, opened } = (await request.json()) as {
    selection_id: string;
    opened: boolean;
  };

  if (!selection_id) {
    return NextResponse.json({ message: "Missing selection_id" }, { status: 400 });
  }

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status, accounts_opened_at")
    .eq("user_id", session.user.id)
    .single();

  const allowedStatuses = ["selecting_offers", "completing_requirements", "accounts_verified"];
  if (!onboarding || !allowedStatuses.includes(onboarding.status)) {
    return NextResponse.json(
      { message: "Nieprawidłowy etap onboardingu" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_offer_selections")
    .update({
      account_opened: opened,
      account_opened_at: opened ? new Date().toISOString() : null,
    })
    .eq("id", selection_id)
    .eq("user_id", session.user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  if (opened) {
    logActivity({
      userId: session.user.id,
      action: "onboarding_step",
      resourceType: "account_opened",
      resourceId: selection_id,
    });
  }

  // Check if all 4 accounts are now opened
  const { data: allSelections } = await supabase
    .from("user_offer_selections")
    .select("account_opened")
    .eq("user_id", session.user.id);

  const allOpened =
    allSelections &&
    allSelections.length === 4 &&
    allSelections.every((s) => s.account_opened);

  if (allOpened && !onboarding.accounts_opened_at) {
    await supabase
      .from("user_onboarding")
      .update({ accounts_opened_at: new Date().toISOString() })
      .eq("user_id", session.user.id);

    const userEmail = session.user.email || "Użytkownik";
    await supabase.from("admin_notifications").insert({
      type: "accounts_opened",
      title: "Konta otwarte",
      message: `${userEmail} otworzył(a) wszystkie 4 konta bankowe i czeka na weryfikację.`,
      related_user_id: session.user.id,
    });
  }

  return NextResponse.json({ success: true, all_opened: !!allOpened });
}
