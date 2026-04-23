import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { listFiles, listFilesRecursive, getFile } from "@/lib/google-drive";
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

function userCanAccessSource(
  source: DriveSource,
  userRoles: string[]
): boolean {
  if (!source.role_required) return true;
  if (userRoles.includes("admin")) return true;
  return userRoles.includes(source.role_required);
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
  const section = searchParams.get("section");
  const folderId = searchParams.get("folderId");

  // If folderId is provided, list files in that specific folder (non-recursive, admin preview)
  if (folderId) {
    try {
      const files = await listFiles(folderId);
      return NextResponse.json(
        files.map((f) => ({
          id: f.id,
          name: f.name,
          mimeType: f.mimeType,
          size: f.size,
          modifiedTime: f.modifiedTime,
          source: "drive" as const,
          folderId,
        }))
      );
    } catch (error) {
      console.error("Error listing Drive folder:", error);
      return NextResponse.json(
        { message: "Failed to list Drive folder" },
        { status: 500 }
      );
    }
  }

  // Get user roles for content gating
  const userRoles = await getUserRoleNames(supabase, session.user.id);

  // List files from configured drive_sources, filtered by role access
  let query = supabase.from("drive_sources").select("*");
  if (section) {
    query = query.eq("section", section);
  }

  const { data: sources, error: sourcesError } = await query;

  if (sourcesError) {
    console.error("Error fetching drive_sources:", sourcesError);
    return NextResponse.json(
      { message: "Failed to fetch drive sources" },
      { status: 500 }
    );
  }

  const allFiles: Array<{
    id: string;
    name: string;
    mimeType: string;
    size: number | null;
    modifiedTime: string | null;
    source: "drive";
    folderId: string;
    sourceName: string;
    section: string | null;
  }> = [];

  for (const src of (sources || []) as DriveSource[]) {
    if (!userCanAccessSource(src, userRoles)) continue;

    try {
      if (src.drive_type === "folder") {
        const files = await listFilesRecursive(src.drive_id);
        for (const f of files) {
          allFiles.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            size: f.size,
            modifiedTime: f.modifiedTime,
            source: "drive",
            folderId: src.drive_id,
            sourceName: src.name,
            section: src.section,
          });
        }
      } else {
        const f = await getFile(src.drive_id);
        if (f) {
          allFiles.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            size: f.size,
            modifiedTime: f.modifiedTime,
            source: "drive",
            folderId: f.parents[0] || "",
            sourceName: src.name,
            section: src.section,
          });
        }
      }
    } catch (error) {
      console.error(`Error listing Drive source "${src.name}":`, error);
    }
  }

  return NextResponse.json(allFiles, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
