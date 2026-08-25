"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
import { urlFor } from "@/lib/sanity-image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import density from "@/components/sections/homepage-density.module.css";

interface HeaderProps {
  showBlog?: boolean;
  showLogin?: boolean;
  logo?: SanityImageSource | null;
}

export function Header({
  showBlog = true,
  showLogin = true,
  logo = null,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const navLinks = useMemo(() => {
    const links = [
      { href: "/oferty", label: "Oferty" },
      ...(showBlog ? [{ href: "/blog", label: "Blog" }] : []),
      { href: "/wspolpraca", label: "Współpraca" },
    ];
    return links;
  }, [showBlog]);

  const logoUrl = logo
    ? urlFor(logo).height(64).fit("max").url()
    : null;

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
      (_event, session) => {
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
    <header
      data-home-header
      className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-lg"
    >
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-1 flex items-center justify-between ${density.headerInner}`}
      >
        <Link href="/" className="flex items-center gap-1.5 min-h-[44px]">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Afiliantka Faceless"
              width={180}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          ) : (
            <>
              <span className="text-lg sm:text-xl font-bold text-brand">
                Afiliantka
              </span>
              <span className="text-lg sm:text-xl font-light text-slate-400">
                Faceless
              </span>
            </>
          )}
        </Link>

        <nav
          className="hidden sm:flex gap-1 items-center"
          aria-label="Główne menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 min-h-[44px] inline-flex items-center ${
                isActive(link.href)
                  ? "text-brand bg-brand-light"
                  : "text-slate-600 hover:text-brand hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {showLogin && (
            <div className="ml-4 flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    href={appOrigin ? `${appOrigin}/dashboard` : "/dashboard"}
                    className="inline-flex items-center px-5 py-2 min-h-[44px] text-sm font-semibold text-white bg-gradient-to-r from-brand to-teal-500 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-slate-500 hover:text-slate-700 text-sm min-h-[44px]"
                  >
                    Wyloguj
                  </Button>
                </>
              ) : (
                <Link
                  href={appOrigin ? `${appOrigin}/login` : "/login"}
                  className="inline-flex items-center px-5 py-2 min-h-[44px] text-sm font-semibold text-white bg-gradient-to-r from-brand to-teal-500 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Zaloguj się
                </Link>
              )}
            </div>
          )}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          className="sm:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1"
          aria-label="Menu mobilne"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 min-h-[44px] rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                isActive(link.href)
                  ? "text-brand bg-brand-light"
                  : "text-slate-700 hover:text-brand hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {showLogin &&
            (user ? (
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
                  Wyloguj
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
            ))}
        </nav>
      )}
    </header>
  );
}
