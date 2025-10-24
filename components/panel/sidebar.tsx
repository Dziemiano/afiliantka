"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isAdmin: boolean;
}

export function Sidebar({ isAdmin }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/panel/offers", label: "Offers" },
    { href: "/panel/onboard", label: "Onboard" },
    { href: "/panel/files", label: "Files" },
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <aside className="w-64 border-r bg-neutral-50/95 p-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-stone-700">Navigation</h2>
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
      </div>
    </aside>
  );
}
