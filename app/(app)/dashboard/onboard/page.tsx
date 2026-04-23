"use client";

import { FileBrowser } from "@/components/dashboard/file-browser";

export default function OnboardPage() {
  return (
    <FileBrowser
      title="Materiały onboardingowe"
      description="Pliki i zasoby pomagające w rozpoczęciu pracy."
      blobPathFilter="/onboard/"
      driveSection="onboard"
      emptyMessage="Brak materiałów onboardingowych. Skontaktuj się z administratorem."
    />
  );
}
