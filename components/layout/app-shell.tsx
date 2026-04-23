"use client";

import { useState, useCallback, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar: always visible at md+ */}
      <div className="hidden md:block md:w-64 md:flex-shrink-0">
        {sidebar}
      </div>

      {/* Mobile sidebar: overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={closeSidebar}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 md:hidden">
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={closeSidebar}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-stone-500 hover:bg-stone-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {sidebar}
          </div>
        </>
      )}

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-stone-200 bg-white md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-stone-800 truncate">
            Afiliantka
          </span>
          {header && <div className="ml-auto flex items-center">{header}</div>}
        </header>

        {/* Desktop header (optional, e.g. admin notification bell) */}
        {header && (
          <header className="hidden md:flex items-center justify-end px-6 py-3 border-b border-stone-200 bg-white">
            {header}
          </header>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-white">{children}</main>
      </div>
    </div>
  );
}
