'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <header className="border-b bg-neutral-50/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/60 border-stone-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-2xl font-bold text-stone-700">
            Afiliantka Faceless
          </Link>
          <Badge
            variant="secondary"
            className="bg-stone-100 text-stone-600 border-stone-300"
          >
            Beta
          </Badge>
        </div>
        <nav className="flex gap-6 items-center">
          <Link
            href="/oferty"
            className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
          >
            Oferty
          </Link>
          {user ? (
            <Button onClick={handleLogout} variant="ghost" className="text-stone-700 hover:text-stone-900 font-medium transition-colors">
              Logout
            </Button>
          ) : (
            <Link
              href="/login"
              className="text-stone-700 hover:text-stone-900 font-medium transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
