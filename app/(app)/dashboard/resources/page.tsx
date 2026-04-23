"use client";

import { FileBrowser } from "@/components/dashboard/file-browser";

export default function ResourcesPage() {
  return (
    <FileBrowser
      title="Zasoby"
      description="Poradniki, tutoriale i materiały edukacyjne."
      blobPathFilter="/resources/"
      driveSection="resources"
      emptyMessage="Brak dostępnych zasobów."
    />
  );
}
