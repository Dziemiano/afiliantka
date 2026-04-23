"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DriveSource } from "@/types/file";
import {
  Folder,
  File,
  Trash2,
  Eye,
  ChevronUp,
  ChevronRight,
  Plus,
  ArrowLeft,
  Search,
  X,
} from "lucide-react";

interface BrowseItem {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
  modifiedTime: string | null;
  isFolder: boolean;
}

interface BreadcrumbEntry {
  id: string | null;
  name: string;
}

interface DriveFilePreview {
  id: string;
  name: string;
  mimeType: string;
  size: number | null;
  modifiedTime: string | null;
}

export default function AdminDrivePage() {
  // Active sources state
  const [sources, setSources] = useState<DriveSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  const [previewFiles, setPreviewFiles] = useState<DriveFilePreview[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Browse state
  const [browseOpen, setBrowseOpen] = useState(false);
  const [browseItems, setBrowseItems] = useState<BrowseItem[]>([]);
  const [browseLoading, setBrowseLoading] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbEntry[]>([
    { id: null, name: "Shared with me" },
  ]);

  // Add-from-browse state
  const [addingItem, setAddingItem] = useState<BrowseItem | null>(null);
  const [addName, setAddName] = useState("");
  const [addSection, setAddSection] = useState("");
  const [addRoleRequired, setAddRoleRequired] = useState("");
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // Advanced manual add state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [manualDriveId, setManualDriveId] = useState("");
  const [manualDriveType, setManualDriveType] = useState<"file" | "folder">("folder");
  const [manualName, setManualName] = useState("");
  const [manualSection, setManualSection] = useState("");
  const [manualRoleRequired, setManualRoleRequired] = useState("");
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // Fetch configured sources
  const fetchSources = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/drive/sources?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSources(data);
    } catch (e) {
      console.error("Error fetching drive sources:", e);
      if (e instanceof Error) setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSources();
  }, []);

  // Browse Drive
  const browseDrive = async (folderId: string | null) => {
    setBrowseLoading(true);
    try {
      const url = folderId
        ? `/api/drive/browse?folderId=${folderId}&t=${Date.now()}`
        : `/api/drive/browse?t=${Date.now()}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBrowseItems(data);
    } catch (e) {
      console.error("Error browsing Drive:", e);
    } finally {
      setBrowseLoading(false);
    }
  };

  const handleOpenBrowser = () => {
    setBrowseOpen(true);
    setBreadcrumbs([{ id: null, name: "Shared with me" }]);
    setAddingItem(null);
    browseDrive(null);
  };

  const handleNavigateFolder = (item: BrowseItem) => {
    setBreadcrumbs((prev) => [...prev, { id: item.id, name: item.name }]);
    setAddingItem(null);
    browseDrive(item.id);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setAddingItem(null);
    browseDrive(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handleSelectItem = (item: BrowseItem) => {
    if (addingItem?.id === item.id) {
      setAddingItem(null);
      return;
    }
    setAddingItem(item);
    setAddName(item.name);
    setAddSection("");
    setAddRoleRequired("");
    setAddError(null);
  };

  const handleAddFromBrowse = async () => {
    if (!addingItem) return;
    setAddSubmitting(true);
    setAddError(null);

    try {
      const res = await fetch("/api/drive/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drive_id: addingItem.id,
          drive_type: addingItem.isFolder ? "folder" : "file",
          name: addName.trim(),
          section: addSection.trim() || null,
          role_required: addRoleRequired.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add");
      }

      setAddingItem(null);
      fetchSources();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setAddSubmitting(false);
    }
  };

  // Manual add
  const handleManualAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    setManualSubmitting(true);

    try {
      const res = await fetch("/api/drive/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          drive_id: manualDriveId.trim(),
          drive_type: manualDriveType,
          name: manualName.trim(),
          section: manualSection.trim() || null,
          role_required: manualRoleRequired.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to add drive source");
      }

      setManualDriveId("");
      setManualName("");
      setManualSection("");
      setManualRoleRequired("");
      fetchSources();
    } catch (err) {
      setManualError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setManualSubmitting(false);
    }
  };

  // Remove source
  const handleRemove = async (id: string) => {
    if (!confirm("Remove this drive source?")) return;
    try {
      const res = await fetch(`/api/drive/config?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove");
      fetchSources();
    } catch (err) {
      console.error("Error removing source:", err);
    }
  };

  // Preview source contents
  const handlePreview = async (source: DriveSource) => {
    if (expandedSource === source.id) {
      setExpandedSource(null);
      setPreviewFiles([]);
      return;
    }
    setExpandedSource(source.id);
    setPreviewLoading(true);
    try {
      const res = await fetch(
        `/api/drive/list?folderId=${source.drive_id}&t=${Date.now()}`
      );
      if (res.ok) {
        const data = await res.json();
        setPreviewFiles(data);
      }
    } catch (err) {
      console.error("Error loading preview:", err);
    } finally {
      setPreviewLoading(false);
    }
  };

  function formatSize(bytes: number | null): string {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }

  const isAlreadyAdded = (driveId: string) =>
    sources.some((s) => s.drive_id === driveId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Google Drive Sources</h1>
        <p className="text-sm text-stone-500 mt-1">
          Browse your Google Drive to select folders and files to share with
          users, or add them manually by ID.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Browse + Add */}
        <div className="space-y-4">
          {/* Browse Drive Card */}
          <Card className="bg-white border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg text-stone-700">
                Browse Drive
              </CardTitle>
              <CardDescription>
                Navigate your Google Drive and pick folders or files to expose
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!browseOpen ? (
                <Button
                  onClick={handleOpenBrowser}
                  className="w-full bg-stone-600 hover:bg-stone-700 text-white"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Google Drive
                </Button>
              ) : (
                <div className="space-y-3">
                  {/* Breadcrumbs */}
                  <div className="flex items-center gap-1 text-sm flex-wrap border-b border-stone-200 pb-2">
                    {breadcrumbs.map((crumb, i) => (
                      <span key={i} className="flex items-center">
                        {i > 0 && (
                          <ChevronRight className="h-3 w-3 text-stone-400 mx-1" />
                        )}
                        <button
                          onClick={() => handleBreadcrumbClick(i)}
                          className={`hover:underline ${
                            i === breadcrumbs.length - 1
                              ? "text-stone-800 font-medium"
                              : "text-stone-500"
                          }`}
                        >
                          {crumb.name}
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Back + close */}
                  <div className="flex items-center justify-between">
                    {breadcrumbs.length > 1 && (
                      <button
                        onClick={() =>
                          handleBreadcrumbClick(breadcrumbs.length - 2)
                        }
                        className="flex items-center gap-1 px-2 py-2 min-h-[44px] text-sm text-stone-500 hover:text-stone-700"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        Back
                      </button>
                    )}
                    <button
                      onClick={() => setBrowseOpen(false)}
                      className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-600 ml-auto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Items list */}
                  {browseLoading ? (
                    <p className="text-sm text-stone-500 py-4 text-center">
                      Loading...
                    </p>
                  ) : browseItems.length === 0 ? (
                    <p className="text-sm text-stone-500 py-4 text-center">
                      No items found.
                    </p>
                  ) : (
                    <div className="border border-stone-200 rounded-md divide-y divide-stone-100 max-h-80 overflow-y-auto">
                      {browseItems.map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-stone-50">
                            {item.isFolder ? (
                              <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                            ) : (
                              <File className="h-4 w-4 text-stone-400 shrink-0" />
                            )}

                            {item.isFolder ? (
                              <button
                                onClick={() => handleNavigateFolder(item)}
                                className="text-sm text-stone-700 hover:text-stone-900 hover:underline truncate text-left flex-1"
                              >
                                {item.name}
                              </button>
                            ) : (
                              <span className="text-sm text-stone-700 truncate flex-1">
                                {item.name}
                              </span>
                            )}

                            <span className="text-xs text-stone-400 shrink-0">
                              {formatSize(item.size)}
                            </span>

                            {isAlreadyAdded(item.id) ? (
                              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded shrink-0">
                                Added
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSelectItem(item)}
                                className={`shrink-0 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded transition-colors ${
                                  addingItem?.id === item.id
                                    ? "bg-blue-100 text-blue-700"
                                    : "text-stone-400 hover:text-blue-600 hover:bg-blue-50"
                                }`}
                                title="Add this item"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            )}
                          </div>

                          {/* Inline config form */}
                          {addingItem?.id === item.id && (
                            <div className="px-3 pb-3 pt-1 bg-blue-50 border-t border-blue-100 space-y-2">
                              <div>
                                <label className="block text-xs font-medium text-stone-600 mb-0.5">
                                  Display Name
                                </label>
                                <Input
                                  value={addName}
                                  onChange={(e) => setAddName(e.target.value)}
                                  className="h-8 text-sm border-stone-300"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-stone-600 mb-0.5">
                                    Section
                                  </label>
                                  <select
                                    value={addSection}
                                    onChange={(e) =>
                                      setAddSection(e.target.value)
                                    }
                                    className="w-full border border-stone-300 rounded-md px-2 py-1 text-sm h-8"
                                  >
                                    <option value="">General</option>
                                    <option value="onboard">Onboard</option>
                                    <option value="resources">Resources</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-stone-600 mb-0.5">
                                    Role Required
                                  </label>
                                  <Input
                                    value={addRoleRequired}
                                    onChange={(e) =>
                                      setAddRoleRequired(e.target.value)
                                    }
                                    placeholder="(any)"
                                    className="h-8 text-sm border-stone-300"
                                  />
                                </div>
                              </div>
                              {addError && (
                                <p className="text-red-500 text-xs">
                                  {addError}
                                </p>
                              )}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={handleAddFromBrowse}
                                  disabled={addSubmitting || !addName.trim()}
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                                >
                                  {addSubmitting ? "Adding..." : "Add Source"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setAddingItem(null)}
                                  className="text-xs h-7"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced: Manual Add */}
          <Card className="bg-white border-stone-200">
            <CardHeader className="cursor-pointer" onClick={() => setShowAdvanced(!showAdvanced)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-stone-500">
                  Advanced: Add by ID
                </CardTitle>
                <ChevronRight
                  className={`h-4 w-4 text-stone-400 transition-transform ${
                    showAdvanced ? "rotate-90" : ""
                  }`}
                />
              </div>
            </CardHeader>
            {showAdvanced && (
              <CardContent>
                <form onSubmit={handleManualAdd} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-0.5">
                        Type
                      </label>
                      <select
                        value={manualDriveType}
                        onChange={(e) =>
                          setManualDriveType(
                            e.target.value as "file" | "folder"
                          )
                        }
                        className="w-full border border-stone-300 rounded-md px-2 py-1 text-sm"
                      >
                        <option value="folder">Folder</option>
                        <option value="file">File</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-600 mb-0.5">
                        Section
                      </label>
                      <select
                        value={manualSection}
                        onChange={(e) => setManualSection(e.target.value)}
                        className="w-full border border-stone-300 rounded-md px-2 py-1 text-sm"
                      >
                        <option value="">General</option>
                        <option value="onboard">Onboard</option>
                        <option value="resources">Resources</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-0.5">
                      Drive ID
                    </label>
                    <Input
                      value={manualDriveId}
                      onChange={(e) => setManualDriveId(e.target.value)}
                      placeholder="From Drive URL after /folders/ or /d/"
                      className="border-stone-300 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-0.5">
                      Display Name
                    </label>
                    <Input
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="e.g. Marketing Materials"
                      className="border-stone-300 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 mb-0.5">
                      Role Required (optional)
                    </label>
                    <Input
                      value={manualRoleRequired}
                      onChange={(e) => setManualRoleRequired(e.target.value)}
                      placeholder="e.g. user, onboard"
                      className="border-stone-300 text-sm"
                    />
                  </div>
                  {manualError && (
                    <p className="text-red-500 text-xs">{manualError}</p>
                  )}
                  <Button
                    type="submit"
                    disabled={manualSubmitting}
                    className="w-full bg-stone-600 hover:bg-stone-700 text-white text-sm"
                  >
                    {manualSubmitting ? "Adding..." : "Add by ID"}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Right column: Active Sources */}
        <Card className="bg-white border-stone-200 h-fit">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              Active Sources
            </CardTitle>
            <CardDescription>
              Currently linked Google Drive sources
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="text-red-500 text-sm">{error}</p>
            ) : isLoading ? (
              <p className="text-stone-500">Loading sources...</p>
            ) : sources.length === 0 ? (
              <p className="text-stone-500">No drive sources configured yet.</p>
            ) : (
              <div className="space-y-3">
                {sources.map((src) => (
                  <div key={src.id}>
                    <div className="p-3 border border-stone-200 rounded-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          {src.drive_type === "folder" ? (
                            <Folder className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                          ) : (
                            <File className="h-5 w-5 text-stone-400 mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-stone-700">
                              {src.name}
                            </p>
                            <p className="text-xs text-stone-400 truncate font-mono">
                              {src.drive_id}
                            </p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {src.section && (
                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">
                                  {src.section}
                                </span>
                              )}
                              {src.role_required && (
                                <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded">
                                  role: {src.role_required}
                                </span>
                              )}
                              <span className="px-2 py-0.5 text-xs bg-stone-100 text-stone-600 rounded">
                                {src.drive_type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {src.drive_type === "folder" && (
                            <button
                              onClick={() => handlePreview(src)}
                              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-700 hover:bg-stone-100 rounded"
                              title="Preview contents"
                            >
                              {expandedSource === src.id ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleRemove(src.id)}
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Remove source"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {expandedSource === src.id && (
                      <div className="mt-1 ml-7 p-3 bg-stone-50 border border-stone-200 rounded-md">
                        {previewLoading ? (
                          <p className="text-sm text-stone-500">
                            Loading contents...
                          </p>
                        ) : previewFiles.length === 0 ? (
                          <p className="text-sm text-stone-500">
                            No files found in this folder.
                          </p>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-xs text-stone-500 mb-2">
                              {previewFiles.length} file(s) found
                            </p>
                            {previewFiles.map((f) => (
                              <div
                                key={f.id}
                                className="flex items-center justify-between text-sm py-1"
                              >
                                <span className="text-stone-700 truncate flex-1">
                                  {f.name}
                                </span>
                                <span className="text-stone-400 text-xs ml-2 shrink-0">
                                  {formatSize(f.size)}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
