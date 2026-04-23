import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logActivity, type ActivityAction } from "@/lib/activity";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, resourceType, resourceId, resourceName } = body as {
      action: ActivityAction;
      resourceType?: string;
      resourceId?: string;
      resourceName?: string;
    };

    if (!action) {
      return NextResponse.json({ message: "Missing action" }, { status: 400 });
    }

    logActivity({
      userId: session.user.id,
      action,
      resourceType,
      resourceId,
      resourceName,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }
}
