"use client";

import { useEffect, useState, useMemo } from "react";
import type { FileItem } from "@/types/file";
import {
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  FileCode,
  Download,
  HardDrive,
  Cloud,
  ChevronDown,
  ChevronRight,
  Folder,
  Search,
} from "lucide-react";

interface BlobItem {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
  size?: number;
  uploadedAt?: string;
}

interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
  modifiedTime: string | null;
  source: "drive";
  sourceName: string;
  section: string | null;
}

function normalizeBlobToFileItem(blob: BlobItem): FileItem {
  const parts = blob.pathname.replace(/^\//, "").split("/");
  const section = parts.length > 1 ? parts[0] : null;
  return {
    id: blob.url,
    name: parts[parts.length - 1] || blob.pathname,
    path: blob.pathname,
    mimeType: blob.contentType || "application/octet-stream",
    size: blob.size ?? null,
    modifiedAt: blob.uploadedAt ?? null,
    source: "blob",
    downloadUrl: blob.downloadUrl,
    previewUrl: blob.url,
    section,
    sourceName: section || "Uploads",
  };
}

function normalizeDriveToFileItem(file: DriveItem): FileItem {
  return {
    id: file.id,
    name: file.name,
    path: file.sourceName ? `${file.sourceName}/${file.name}` : file.name,
    mimeType: file.mimeType || "application/octet-stream",
    size: file.size,
    modifiedAt: file.modifiedTime,
    source: "drive",
    downloadUrl: `/api/drive/download?fileId=${file.id}`,
    section: file.section,
    sourceName: file.sourceName,
  };
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFileIcon(mimeType: string | undefined) {
  const mime = mimeType || "";
  if (mime.startsWith("image/"))
    return <ImageIcon className="h-5 w-5 text-blue-500" />;
  if (mime.startsWith("video/"))
    return <Film className="h-5 w-5 text-purple-500" />;
  if (mime.startsWith("audio/"))
    return <Music className="h-5 w-5 text-green-500" />;
  if (
    mime.includes("pdf") ||
    mime.includes("document") ||
    mime.includes("presentation")
  )
    return <FileText className="h-5 w-5 text-red-500" />;
  if (
    mime.includes("json") ||
    mime.includes("javascript") ||
    mime.includes("html") ||
    mime.includes("xml")
  )
    return <FileCode className="h-5 w-5 text-amber-500" />;
  return <FileText className="h-5 w-5 text-stone-400" />;
}

function SourceBadge({ source }: { source: "blob" | "drive" }) {
  if (source === "drive") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
        <Cloud className="h-3 w-3" />
        Drive
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-stone-50 text-stone-600 rounded">
      <HardDrive className="h-3 w-3" />
      Blob
    </span>
  );
}

export interface FileBrowserSection {
  key: string;
  label: string;
}

interface FileBrowserProps {
  sections?: FileBrowserSection[];
  defaultSection?: string;
  blobPathFilter?: string;
  driveSection?: string;
  showSectionTabs?: boolean;
  title: string;
  description: string;
  emptyMessage?: string;
}

export function FileBrowser({
  sections,
  defaultSection,
  blobPathFilter,
  driveSection,
  showSectionTabs = false,
  title,
  description,
  emptyMessage = "Brak dostępnych plików.",
}: FileBrowserProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState(
    defaultSection || "all"
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set()
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAllFiles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cacheBuster = Date.now();
        const driveUrl = driveSection
          ? `/api/drive/list?section=${driveSection}&t=${cacheBuster}`
          : `/api/drive/list?t=${cacheBuster}`;

        const [blobRes, driveRes] = await Promise.allSettled([
          fetch(`/api/blobs/list?t=${cacheBuster}`, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }),
          fetch(driveUrl, {
            cache: "no-store",
            headers: { "Cache-Control": "no-cache" },
          }),
        ]);

        const allFiles: FileItem[] = [];

        if (blobRes.status === "fulfilled" && blobRes.value.ok) {
          const blobData: BlobItem[] = await blobRes.value.json();
          let filtered = blobData.filter(
            (b) => !b.pathname.endsWith("/") && !b.pathname.endsWith(".keep")
          );
          if (blobPathFilter) {
            filtered = filtered.filter((b) =>
              b.pathname.startsWith(blobPathFilter)
            );
          }
          allFiles.push(...filtered.map(normalizeBlobToFileItem));
        }

        if (driveRes.status === "fulfilled" && driveRes.value.ok) {
          const driveData: DriveItem[] = await driveRes.value.json();
          allFiles.push(...driveData.map(normalizeDriveToFileItem));
        }

        allFiles.sort((a, b) => a.name.localeCompare(b.name));
        setFiles(allFiles);
      } catch (e) {
        console.error("Error fetching files:", e);
        if (e instanceof Error) setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllFiles();
  }, [driveSection, blobPathFilter]);

  const filteredFiles = useMemo(() => {
    let result = files;

    if (activeSection !== "all" && showSectionTabs) {
      result = result.filter((f) => {
        if (!f.section) return activeSection === "general";
        return f.section === activeSection;
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.path.toLowerCase().includes(q)
      );
    }

    return result;
  }, [files, activeSection, searchQuery, showSectionTabs]);

  const groupedFiles = useMemo(() => {
    const groups = new Map<string, FileItem[]>();

    for (const file of filteredFiles) {
      const groupName = file.sourceName || "Inne";
      if (!groups.has(groupName)) groups.set(groupName, []);
      groups.get(groupName)!.push(file);
    }

    return Array.from(groups.entries()).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [filteredFiles]);

  const availableSections = useMemo(() => {
    if (!sections) return [];
    const sectionKeys = new Set(
      files.map((f) => f.section || "general")
    );
    sectionKeys.add("all");
    return [
      { key: "all", label: "Wszystko" },
      ...sections.filter((s) => sectionKeys.has(s.key)),
    ];
  }, [files, sections]);

  const toggleGroup = (name: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-stone-200 rounded w-48" />
          <div className="h-4 bg-stone-100 rounded w-72" />
          <div className="space-y-2 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-stone-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">Błąd: {error}</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
          <p className="text-sm text-stone-500 mt-1">{description}</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Szukaj plików..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2.5 min-h-[44px] text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
          />
        </div>
      </div>

      {showSectionTabs && availableSections.length > 2 && (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1 p-1 bg-stone-100 rounded-lg w-fit">
            {availableSections.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(s.key)}
                className={`px-4 py-2 min-h-[44px] text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeSection === s.key
                    ? "bg-white text-stone-900 shadow-sm"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <FileText className="h-12 w-12 mx-auto mb-3 text-stone-300" />
          <p>{searchQuery ? "Brak wyników wyszukiwania." : emptyMessage}</p>
        </div>
      ) : groupedFiles.length === 1 ? (
        <FileTable files={filteredFiles} />
      ) : (
        <div className="space-y-4">
          {groupedFiles.map(([groupName, groupFiles]) => {
            const isCollapsed = collapsedGroups.has(groupName);
            return (
              <div
                key={groupName}
                className="border border-stone-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleGroup(groupName)}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[44px] bg-stone-50 hover:bg-stone-100 transition-colors text-left"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-stone-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-stone-500" />
                  )}
                  <Folder className="h-5 w-5 text-amber-500" />
                  <span className="text-sm font-semibold text-stone-800">
                    {groupName}
                  </span>
                  <span className="text-xs text-stone-400 ml-auto">
                    {groupFiles.length}{" "}
                    {groupFiles.length === 1 ? "plik" : "plików"}
                  </span>
                </button>
                {!isCollapsed && <FileTable files={groupFiles} />}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 text-xs text-stone-400">
        {filteredFiles.length}{" "}
        {filteredFiles.length === 1 ? "plik" : "plików"}
        {searchQuery && ` (szukanie: "${searchQuery}")`}
      </div>
    </div>
  );
}

function trackDownload(file: FileItem) {
  try {
    const payload = JSON.stringify({
      action: "file_download",
      resourceType: file.source,
      resourceId: file.id,
      resourceName: file.name,
    });
    navigator.sendBeacon("/api/activity/track", new Blob([payload], { type: "application/json" }));
  } catch {
    // best-effort tracking
  }
}

function FileTable({ files }: { files: FileItem[] }) {
  return (
    <div>
      <div className="hidden md:grid md:grid-cols-[1fr_100px_100px_80px_80px] gap-4 px-4 py-2.5 bg-stone-50/50 border-b border-stone-200 text-xs font-medium text-stone-500 uppercase tracking-wider">
        <span>Nazwa</span>
        <span>Rozmiar</span>
        <span>Zmieniony</span>
        <span>Źródło</span>
        <span></span>
      </div>

      {files.map((file) => (
        <div
          key={file.id}
          className="grid grid-cols-1 md:grid-cols-[1fr_100px_100px_80px_80px] gap-2 md:gap-4 px-4 py-3 border-b border-stone-100 last:border-b-0 hover:bg-stone-50 transition-colors items-center"
        >
          <div className="flex items-center gap-3 min-w-0">
            {getFileIcon(file.mimeType)}
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">
                {file.name}
              </p>
              {file.path !== file.name && (
                <p className="text-xs text-stone-400 truncate">{file.path}</p>
              )}
            </div>
          </div>

          <span className="text-sm text-stone-500 hidden md:block">
            {formatSize(file.size)}
          </span>

          <span className="text-sm text-stone-500 hidden md:block">
            {formatDate(file.modifiedAt)}
          </span>

          <div className="hidden md:block">
            <SourceBadge source={file.source} />
          </div>

          <div className="flex justify-end">
            <a
              href={file.downloadUrl}
              download={file.source === "blob" ? file.name : undefined}
              onClick={() => trackDownload(file)}
              className="inline-flex items-center gap-1 px-3 py-2 min-h-[44px] text-sm text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-md transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Pobierz</span>
            </a>
          </div>

          <div className="flex items-center gap-3 md:hidden text-xs text-stone-400">
            <span>{formatSize(file.size)}</span>
            <span>{formatDate(file.modifiedAt)}</span>
            <SourceBadge source={file.source} />
          </div>
        </div>
      ))}
    </div>
  );
}
