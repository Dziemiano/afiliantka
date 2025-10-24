"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Blob {
  url: string;
  downloadUrl: string;
  pathname: string;
  contentType: string;
}

const supportedImageMimes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
];
const supportedVideoMimes = ["video/mp4", "video/webm", "video/ogg"];
const supportedAudioMimes = ["audio/mpeg", "audio/ogg", "audio/wav"];
const supportedIframeMimes = [
  "application/pdf",
  "application/json",
  "text/plain",
  "text/html",
];

export default function OnboardPage() {
  const [blobs, setBlobs] = useState<Blob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Add cache busting parameter to ensure fresh data
        const cacheBuster = Date.now();
        const response = await fetch(`/api/blobs/list?t=${cacheBuster}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Filter for files in the /onboard folder and exclude folder markers
        const filteredBlobs = data.filter(
          (blob: Blob) =>
            blob.pathname.startsWith("/onboard/") &&
            !blob.pathname.endsWith("/") &&
            !blob.pathname.endsWith(".keep")
        );
        setBlobs(filteredBlobs);
        console.log("Fetched onboard blobs:", filteredBlobs.length);
      } catch (e) {
        console.error("Error fetching onboard blobs:", e);
        if (e instanceof Error) {
          setError(e.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlobs();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">Loading onboarding files...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Onboarding Materials</h1>
      <p className="text-gray-600 mb-6">
        Access onboarding files and resources. These materials are provided to
        help you get started.
      </p>
      {blobs.length === 0 ? (
        <p>
          No onboarding files available. Contact an administrator if you need
          access to onboarding materials.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blobs.map((blob) => (
            <div key={blob.url} className="border rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-2 truncate">
                {blob.pathname.replace("/onboard/", "")}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{blob.contentType}</p>
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden rounded-md mb-4">
                {supportedImageMimes.includes(blob.contentType) ? (
                  <Image
                    src={blob.url}
                    alt={blob.pathname}
                    width={200}
                    height={200}
                    objectFit="contain"
                  />
                ) : supportedVideoMimes.includes(blob.contentType) ? (
                  <video
                    controls
                    src={blob.url}
                    className="max-h-full max-w-full"
                  />
                ) : supportedAudioMimes.includes(blob.contentType) ? (
                  <audio controls src={blob.url} className="w-full" />
                ) : supportedIframeMimes.includes(blob.contentType) ? (
                  <iframe
                    src={blob.url}
                    title={blob.pathname}
                    className="w-full h-full border-0"
                  />
                ) : (
                  <a
                    href={blob.downloadUrl}
                    className="text-blue-500 hover:underline p-4 text-center"
                  >
                    Download {blob.pathname.replace("/onboard/", "")}
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href={blob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:underline truncate"
                >
                  View Original
                </a>
                <a
                  href={blob.downloadUrl}
                  className="text-sm text-green-500 hover:underline truncate"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
