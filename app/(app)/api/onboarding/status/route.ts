import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UserOnboarding, UserOfferSelection } from "@/types/onboarding";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  if (!onboarding) {
    const { data: created } = await supabase
      .from("user_onboarding")
      .insert({ user_id: session.user.id, status: "reading_pdf" })
      .select()
      .single();
    onboarding = created;
  }

  const { data: selections } = await supabase
    .from("user_offer_selections")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at");

  return NextResponse.json({
    onboarding: onboarding as UserOnboarding,
    selections: (selections || []) as UserOfferSelection[],
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body as { status: string };

  const validTransitions: Record<string, string[]> = {
    reading_pdf: ["selecting_offers"],
    selecting_offers: ["reading_pdf", "completing_requirements"],
    completing_requirements: ["selecting_offers", "pending_approval"],
    accounts_verified: ["completing_requirements"],
  };

  const { data: current } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", session.user.id)
    .single();

  if (!current) {
    return NextResponse.json({ message: "No onboarding record" }, { status: 404 });
  }

  const allowed = validTransitions[current.status];
  if (!allowed || !allowed.includes(status)) {
    return NextResponse.json(
      { message: `Cannot transition from ${current.status} to ${status}` },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = { status };
  if (status === "selecting_offers") updates.pdf_acknowledged_at = new Date().toISOString();
  if (status === "completing_requirements") updates.offers_selected_at = new Date().toISOString();
  if (status === "pending_approval") updates.requirements_completed_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("user_onboarding")
    .update(updates)
    .eq("user_id", session.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ onboarding: data });
}
