import { google, drive_v3 } from "googleapis";

let driveClient: drive_v3.Drive | null = null;

function getDriveClient(): drive_v3.Drive {
  if (driveClient) return driveClient;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
        /\\n/g,
        "\n"
      ),
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
  modifiedTime: string | null;
  parents: string[];
}

export const FOLDER_MIME = "application/vnd.google-apps.folder";

const FILE_FIELDS = "id, name, mimeType, size, modifiedTime, parents";

export async function listFiles(folderId: string): Promise<DriveFile[]> {
  const drive = getDriveClient();
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed = false`,
      fields: `nextPageToken, files(${FILE_FIELDS})`,
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });

    for (const f of res.data.files || []) {
      if (!f.id || !f.name) continue;
      files.push({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType || "application/octet-stream",
        size: f.size ? parseInt(f.size, 10) : null,
        modifiedTime: f.modifiedTime || null,
        parents: (f.parents as string[]) || [],
      });
    }

    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return files;
}

export async function listSharedItems(): Promise<DriveFile[]> {
  const drive = getDriveClient();
  const files: DriveFile[] = [];
  let pageToken: string | undefined;

  do {
    const res = await drive.files.list({
      q: "sharedWithMe = true and trashed = false",
      fields: `nextPageToken, files(${FILE_FIELDS})`,
      pageSize: 1000,
      pageToken,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      orderBy: "folder,name",
    });

    for (const f of res.data.files || []) {
      if (!f.id || !f.name) continue;
      files.push({
        id: f.id,
        name: f.name,
        mimeType: f.mimeType || "application/octet-stream",
        size: f.size ? parseInt(f.size, 10) : null,
        modifiedTime: f.modifiedTime || null,
        parents: (f.parents as string[]) || [],
      });
    }

    pageToken = res.data.nextPageToken || undefined;
  } while (pageToken);

  return files;
}

export async function listFilesRecursive(
  folderId: string,
  pathPrefix = ""
): Promise<DriveFile[]> {
  const items = await listFiles(folderId);
  const result: DriveFile[] = [];

  for (const item of items) {
    if (item.mimeType === FOLDER_MIME) {
      const subFiles = await listFilesRecursive(
        item.id,
        `${pathPrefix}${item.name}/`
      );
      result.push(...subFiles);
    } else {
      result.push({
        ...item,
        name: `${pathPrefix}${item.name}`,
      });
    }
  }

  return result;
}

export async function getFile(fileId: string): Promise<DriveFile | null> {
  const drive = getDriveClient();

  try {
    const res = await drive.files.get({
      fileId,
      fields: FILE_FIELDS,
      supportsAllDrives: true,
    });

    const f = res.data;
    if (!f.id || !f.name) return null;
    return {
      id: f.id,
      name: f.name,
      mimeType: f.mimeType || "application/octet-stream",
      size: f.size ? parseInt(f.size, 10) : null,
      modifiedTime: f.modifiedTime || null,
      parents: (f.parents as string[]) || [],
    };
  } catch {
    return null;
  }
}

export async function downloadFile(
  fileId: string
): Promise<{ stream: ReadableStream; mimeType: string; name: string } | null> {
  const drive = getDriveClient();

  const meta = await getFile(fileId);
  if (!meta) return null;

  // Google Workspace files (Docs, Sheets, etc.) need export instead of download
  if (meta.mimeType.startsWith("application/vnd.google-apps.")) {
    const exportMimeMap: Record<string, string> = {
      "application/vnd.google-apps.document": "application/pdf",
      "application/vnd.google-apps.spreadsheet":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.google-apps.presentation": "application/pdf",
    };

    const exportMime = exportMimeMap[meta.mimeType] || "application/pdf";

    const res = await drive.files.export(
      { fileId, mimeType: exportMime },
      { responseType: "stream" }
    );

    return {
      stream: nodeStreamToWebStream(res.data),
      mimeType: exportMime,
      name: meta.name,
    };
  }

  const res = await drive.files.get(
    { fileId, alt: "media", supportsAllDrives: true },
    { responseType: "stream" }
  );

  return {
    stream: nodeStreamToWebStream(res.data),
    mimeType: meta.mimeType,
    name: meta.name,
  };
}

function nodeStreamToWebStream(nodeStream: NodeJS.ReadableStream): ReadableStream {
  return new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer) => {
        controller.enqueue(new Uint8Array(chunk));
      });
      nodeStream.on("end", () => {
        controller.close();
      });
      nodeStream.on("error", (err: Error) => {
        controller.error(err);
      });
    },
    cancel() {
      if ("destroy" in nodeStream && typeof nodeStream.destroy === "function") {
        nodeStream.destroy();
      }
    },
  });
}

/**
 * Check if a file is a descendant of a given folder.
 * Walks up the parent chain to verify containment.
 */
export async function isFileInFolder(
  fileId: string,
  folderId: string
): Promise<boolean> {
  const drive = getDriveClient();
  let currentId = fileId;
  const visited = new Set<string>();

  while (currentId) {
    if (currentId === folderId) return true;
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    try {
      const res = await drive.files.get({
        fileId: currentId,
        fields: "parents",
        supportsAllDrives: true,
      });

      const parents = res.data.parents;
      if (!parents || parents.length === 0) return false;
      currentId = parents[0];
    } catch {
      return false;
    }
  }

  return false;
}
