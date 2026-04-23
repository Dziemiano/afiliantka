"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/oferty", label: "Oferty" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const appOrigin = useMemo(() => {
    if (process.env.NEXT_PUBLIC_APP_ORIGIN) {
      return process.env.NEXT_PUBLIC_APP_ORIGIN;
    }
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//app.${window.location.host.replace(/^app\./, "")}`;
    }
    return "";
  }, []);

  useEffect(() => {
    if (!supabaseUrl || !supabaseAnonKey) {
      return;
    }

    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabaseUrl, supabaseAnonKey]);

  const handleLogout = async () => {
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    setMenuOpen(false);
    if (appOrigin) {
      window.location.href = `${appOrigin}/login`;
    } else {
      router.push("/login");
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5">
          <span className="text-lg sm:text-xl font-bold text-brand">Afiliantka</span>
          <span className="text-lg sm:text-xl font-light text-slate-400">Faceless</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex gap-1 items-center">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive(link.href)
                  ? "text-brand bg-brand-light"
                  : "text-slate-600 hover:text-brand hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-2">
            {user ? (
              <>
                <Link
                  href={appOrigin ? `${appOrigin}/dashboard` : "/dashboard"}
                  className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand to-teal-500 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Dashboard
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-slate-500 hover:text-slate-700 text-sm"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href={appOrigin ? `${appOrigin}/login` : "/login"}
                className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-brand to-teal-500 rounded-lg hover:opacity-90 transition-opacity"
              >
                Zaloguj się
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-brand bg-brand-light"
                  : "text-slate-700 hover:text-brand hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={appOrigin ? `${appOrigin}/dashboard` : "/dashboard"}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 min-h-[44px] bg-gradient-to-r from-brand to-teal-500 text-white rounded-lg font-semibold text-sm text-center"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-3 min-h-[44px] text-slate-500 hover:text-slate-700 rounded-lg text-sm text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href={appOrigin ? `${appOrigin}/login` : "/login"}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 min-h-[44px] bg-gradient-to-r from-brand to-teal-500 text-white rounded-lg font-semibold text-sm text-center"
            >
              Zaloguj się
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
