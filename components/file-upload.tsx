"use client";

import { useState, useRef, useEffect } from "react";

interface FileUploadProps {
  onUploadBegin: () => void;
  onUploadEnd: () => void;
  onUploadSuccess: () => void;
  onFolderCreateSuccess: () => void;
}

export function FileUpload({
  onUploadBegin,
  onUploadEnd,
  onUploadSuccess,
  onFolderCreateSuccess,
}: FileUploadProps) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [folders, setFolders] = useState<string[]>(["/"]); // Default to root folder
  const [selectedFolder, setSelectedFolder] = useState<string>("/");
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/blobs/list");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const uniqueFolders = new Set<string>();
      uniqueFolders.add("/"); // Add root folder

      data.forEach((blob: any) => {
        const parts = blob.pathname.split("/");
        let currentPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
          currentPath += parts[i] + "/";
          uniqueFolders.add(currentPath);
        }
      });
      setFolders(Array.from(uniqueFolders).sort());
    } catch (e) {
      if (e instanceof Error) {
        console.error("Failed to fetch folders:", e);
      }
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    setError(null);

    const folderPath =
      selectedFolder === "/"
        ? `${newFolderName.trim()}/`
        : `${selectedFolder}${newFolderName.trim()}/`;
    const placeholderFileName = `${folderPath}.keep`; // Using .keep as a convention for empty folders

    try {
      // Create a small placeholder file with content to satisfy Vercel Blob requirements
      const placeholderContent =
        "This is a placeholder file for folder creation";
      const dummyFile = new File([placeholderContent], ".keep", {
        type: "text/plain",
      });

      const response = await fetch(
        `/api/blobs?filename=${placeholderFileName}`,
        {
          method: "POST",
          body: dummyFile,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create folder.");
      }

      setNewFolderName("");
      await fetchFolders();
      onFolderCreateSuccess();
      alert(`Folder '${folderPath}' created successfully!`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onUploadBegin();
    setError(null);

    try {
      const fileNameWithFolder =
        selectedFolder === "/" ? file.name : `${selectedFolder}${file.name}`;
      const response = await fetch(
        `/api/blobs?filename=${fileNameWithFolder}`,
        {
          method: "POST",
          body: file,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to upload file. Status: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Upload successful:", result);

      // Clear the file input
      if (inputFileRef.current) {
        inputFileRef.current.value = "";
      }

      onUploadSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      onUploadEnd();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-stone-700 mb-4">
        Upload a File
      </h2>
      <div className="mb-4">
        <label
          htmlFor="folder-select"
          className="block text-sm font-medium text-stone-700"
        >
          Select Folder:
        </label>
        <select
          id="folder-select"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm rounded-md"
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          disabled={isCreatingFolder}
        >
          {folders.map((folder) => (
            <option key={folder} value={folder}>
              {folder === "/" ? "Root" : folder}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label
          htmlFor="new-folder-name"
          className="block text-sm font-medium text-stone-700"
        >
          Create New Folder:
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            id="new-folder-name"
            className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 focus:ring-stone-500 focus:border-stone-500 sm:text-sm"
            placeholder="new-folder-name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            disabled={isCreatingFolder}
          />
          <button
            onClick={handleCreateFolder}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-stone-600 hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500"
            disabled={isCreatingFolder || !newFolderName.trim()}
          >
            {isCreatingFolder ? "Creating..." : "Create Folder"}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={inputFileRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isCreatingFolder}
        />
        <button
          onClick={() => inputFileRef.current?.click()}
          className="bg-stone-600 hover:bg-stone-700 text-white font-bold py-2 px-4 rounded"
          disabled={isCreatingFolder}
        >
          Choose File
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
