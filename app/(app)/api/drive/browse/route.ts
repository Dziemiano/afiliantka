import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCurrentUserAdmin } from "@/lib/roles";
import { listFiles, listSharedItems, FOLDER_MIME } from "@/lib/google-drive";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await isCurrentUserAdmin();
  if (!isAdmin) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const folderId = searchParams.get("folderId");

  try {
    const items = folderId
      ? await listFiles(folderId)
      : await listSharedItems();

    const result = items.map((item) => ({
      id: item.id,
      name: item.name,
      mimeType: item.mimeType,
      size: item.size,
      modifiedTime: item.modifiedTime,
      isFolder: item.mimeType === FOLDER_MIME,
    }));

    // Sort: folders first, then files, alphabetically within each group
    result.sort((a, b) => {
      if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error browsing Drive:", error);
    return NextResponse.json(
      { message: "Failed to browse Drive" },
      { status: 500 }
    );
  }
}
