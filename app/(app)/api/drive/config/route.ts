import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminOrModerator } from "@/lib/permissions";
import { getFile, listFiles } from "@/lib/google-drive";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = await isAdminOrModerator();
  if (!allowed) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { drive_id, drive_type, name, section, role_required } = body;

    if (!drive_id || !drive_type || !name) {
      return NextResponse.json(
        { message: "Missing required fields: drive_id, drive_type, name" },
        { status: 400 }
      );
    }

    if (!["file", "folder"].includes(drive_type)) {
      return NextResponse.json(
        { message: "drive_type must be 'file' or 'folder'" },
        { status: 400 }
      );
    }

    // Verify the Drive ID is accessible
    if (drive_type === "file") {
      const file = await getFile(drive_id);
      if (!file) {
        return NextResponse.json(
          {
            message:
              "Cannot access this Drive file. Make sure it is shared with the service account.",
          },
          { status: 400 }
        );
      }
    } else {
      try {
        await listFiles(drive_id);
      } catch {
        return NextResponse.json(
          {
            message:
              "Cannot access this Drive folder. Make sure it is shared with the service account.",
          },
          { status: 400 }
        );
      }
    }

    const { data, error } = await supabase
      .from("drive_sources")
      .insert({
        drive_id,
        drive_type,
        name,
        section: section || null,
        role_required: role_required || null,
        added_by: session.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting drive_source:", error);
      return NextResponse.json(
        { message: "Failed to add drive source" },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in drive config POST:", error);
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = await isAdminOrModerator();
  if (!allowed) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { message: "Missing id parameter" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("drive_sources").delete().eq("id", id);

  if (error) {
    console.error("Error deleting drive_source:", error);
    return NextResponse.json(
      { message: "Failed to remove drive source" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
