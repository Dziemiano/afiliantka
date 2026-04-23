export interface FileItem {
  id: string;
  name: string;
  path: string;
  mimeType: string;
  size: number | null;
  modifiedAt: string | null;
  source: "blob" | "drive";
  downloadUrl: string;
  previewUrl?: string;
  section?: string | null;
  sourceName?: string;
}

export interface DriveSource {
  id: string;
  drive_id: string;
  drive_type: "file" | "folder";
  name: string;
  section: string | null;
  role_required: string | null;
  added_by: string;
  created_at: string;
}
