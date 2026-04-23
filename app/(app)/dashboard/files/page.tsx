"use client";

import {
  FileBrowser,
  type FileBrowserSection,
} from "@/components/dashboard/file-browser";

const SECTIONS: FileBrowserSection[] = [
  { key: "onboard", label: "Onboarding" },
  { key: "resources", label: "Zasoby" },
  { key: "general", label: "Ogólne" },
];

export default function FilesPage() {
  return (
    <FileBrowser
      title="Pliki"
      description="Przeglądaj i pobieraj pliki ze wszystkich źródeł."
      sections={SECTIONS}
      defaultSection="all"
      showSectionTabs
      emptyMessage="Brak dostępnych plików."
    />
  );
}
