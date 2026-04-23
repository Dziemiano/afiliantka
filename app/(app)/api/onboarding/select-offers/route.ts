import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";

interface OfferPayload {
  sanity_id: string;
  slug: string;
  name: string;
  requirement_text: string | null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { action, offer } = body as {
    action: "add" | "remove";
    offer: OfferPayload;
  };

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", session.user.id)
    .single();

  if (!onboarding) {
    return NextResponse.json(
      { message: "Brak rekordu onboardingu" },
      { status: 404 }
    );
  }

  const allowedStatuses = ["selecting_offers", "completing_requirements", "accounts_verified"];
  if (!allowedStatuses.includes(onboarding.status)) {
    return NextResponse.json(
      { message: "Nie można zmieniać ofert na tym etapie" },
      { status: 400 }
    );
  }

  if (action === "add") {
    const { data: existing } = await supabase
      .from("user_offer_selections")
      .select("id")
      .eq("user_id", session.user.id);

    if ((existing?.length || 0) >= 4) {
      return NextResponse.json(
        { message: "Możesz wybrać maksymalnie 4 oferty" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("user_offer_selections").upsert(
      {
        user_id: session.user.id,
        offer_sanity_id: offer.sanity_id,
        offer_slug: offer.slug,
        offer_name: offer.name,
        requirement_text: offer.requirement_text,
        requirement_completed: false,
        completed_at: null,
        rejection_reason: null,
        rejected_at: null,
      },
      { onConflict: "user_id,offer_sanity_id" }
    );

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    // Auto-transition to selecting_offers if still on reading_pdf
    if (onboarding.status === "reading_pdf") {
      await supabase
        .from("user_onboarding")
        .update({ status: "selecting_offers" })
        .eq("user_id", session.user.id);
    }
  } else if (action === "remove") {
    // Can only remove if the requirement is not yet completed
    const { data: sel } = await supabase
      .from("user_offer_selections")
      .select("requirement_completed")
      .eq("user_id", session.user.id)
      .eq("offer_sanity_id", offer.sanity_id)
      .single();

    if (sel?.requirement_completed) {
      return NextResponse.json(
        { message: "Nie można usunąć oferty, której wymaganie zostało już zrealizowane" },
        { status: 400 }
      );
    }

    await supabase
      .from("user_offer_selections")
      .delete()
      .eq("user_id", session.user.id)
      .eq("offer_sanity_id", offer.sanity_id);
  }

  logActivity({
    userId: session.user.id,
    action: action === "add" ? "offer_selected" : "offer_removed",
    resourceType: "offer",
    resourceId: offer.sanity_id,
    resourceName: offer.name,
  });

  const { data: selections } = await supabase
    .from("user_offer_selections")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at");

  return NextResponse.json({ success: true, selections: selections || [] });
}
