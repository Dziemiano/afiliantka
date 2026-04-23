import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { downloadFile, isFileInFolder } from "@/lib/google-drive";
import { logActivity } from "@/lib/activity";
import type { DriveSource } from "@/types/file";

async function getUserRoleNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<string[]> {
  const { data } = await supabase
    .from("user_roles")
    .select("role:roles(name)")
    .eq("user_id", userId);

  if (!data) return [];
  return data
    .map((item) => (item.role as unknown as { name: string })?.name)
    .filter(Boolean);
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get("fileId");
  const inline = searchParams.get("inline") === "true";

  if (!fileId) {
    return NextResponse.json(
      { message: "Missing fileId parameter" },
      { status: 400 }
    );
  }

  const { data: sources, error: sourcesError } = await supabase
    .from("drive_sources")
    .select("*");

  if (sourcesError) {
    return NextResponse.json(
      { message: "Failed to verify access" },
      { status: 500 }
    );
  }

  const userRoles = await getUserRoleNames(supabase, session.user.id);
  const isAdmin = userRoles.includes("admin");
  let hasAccess = false;

  for (const src of (sources || []) as DriveSource[]) {
    if (src.role_required && !isAdmin && !userRoles.includes(src.role_required))
      continue;

    if (src.drive_type === "file" && src.drive_id === fileId) {
      hasAccess = true;
      break;
    }
    if (src.drive_type === "folder") {
      const inFolder = await isFileInFolder(fileId, src.drive_id);
      if (inFolder) {
        hasAccess = true;
        break;
      }
    }
  }

  if (!hasAccess) {
    return NextResponse.json(
      { message: "File not found or access denied" },
      { status: 403 }
    );
  }

  try {
    const result = await downloadFile(fileId);

    if (!result) {
      return NextResponse.json(
        { message: "File not found" },
        { status: 404 }
      );
    }

    const headers = new Headers();
    headers.set("Content-Type", result.mimeType);
    const disposition = inline ? "inline" : "attachment";
    headers.set(
      "Content-Disposition",
      `${disposition}; filename="${encodeURIComponent(result.name)}"`
    );
    headers.set("Cache-Control", "private, max-age=3600");

    logActivity({
      userId: session.user.id,
      action: inline ? "file_view" : "file_download",
      resourceType: "drive_file",
      resourceId: fileId,
      resourceName: result.name,
    });

    return new Response(result.stream, { headers });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { message: "Failed to download file" },
      { status: 500 }
    );
  }
}
