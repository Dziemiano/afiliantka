"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/files", label: "Files" },
  ];

  return (
    <aside className="w-64 border-r bg-neutral-50/95 p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-700">Admin Panel</h2>
          <p className="text-sm text-stone-500">System Management</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-stone-200 text-stone-900"
                  : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-stone-200">
          <Link
            href="/panel"
            className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
          >
            ← Back to Panel
          </Link>
        </div>
      </div>
    </aside>
  );
}
