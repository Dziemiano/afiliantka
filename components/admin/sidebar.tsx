"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  isAdmin?: boolean;
}

export function AdminSidebar({ isAdmin = true }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    ...(isAdmin ? [{ href: "/admin/users", label: "Users" }] : []),
    ...(isAdmin ? [{ href: "/admin/newsletter", label: "Newsletter" }] : []),
    ...(isAdmin ? [{ href: "/admin/content", label: "Publikacje" }] : []),
    { href: "/admin/files", label: "Files" },
    { href: "/admin/drive", label: "Drive Sources" },
    ...(isAdmin ? [{ href: "/admin/activity", label: "Activity Log" }] : []),
    ...(isAdmin ? [{ href: "/admin/analytics", label: "Analytics" }] : []),
    {
      href: "/studio",
      label: "Manage Content",
      external: true,
      description: "Edit offers, pages & content",
    },
  ];

  return (
    <aside className="w-64 h-full border-r bg-white shadow-sm">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Admin</h2>
            </div>
            <Link
              href="/"
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              ← Website
            </Link>
          </div>
          <p className="text-sm text-gray-600">Administrative Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <div className="space-y-2">
            {navItems.map((item) => (
              <div key={item.href} className="space-y-1">
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {item.label}
                  {item.external && (
                    <svg
                      className="w-3 h-3 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  )}
                </Link>
                {item.description && (
                  <p className="text-xs text-gray-500 px-3 -mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <Link
            href="/dashboard"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}
