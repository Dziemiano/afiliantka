"use client";

import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { SkipLink } from "@/components/layout/skip-link";

interface AppShellProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ sidebar, header, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSidebar();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen, closeSidebar]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SkipLink />

      <div className="hidden md:block md:w-64 md:flex-shrink-0">{sidebar}</div>

      {sidebarOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden border-0 cursor-default"
            onClick={closeSidebar}
            aria-label="Zamknij menu"
          />
          <div
            className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu nawigacji"
          >
            <div className="absolute top-3 right-3 z-10">
              <button
                type="button"
                onClick={closeSidebar}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label="Zamknij menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </>
      )}

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-stone-200 bg-white md:justify-end md:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Otwórz menu"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <span className="text-sm font-semibold text-stone-800 truncate md:hidden">
            Afiliantka
          </span>
          {header && (
            <div className="ml-auto flex items-center">{header}</div>
          )}
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 bg-white outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
