"use client";

import Link from "next/link";
import { useMemo } from "react";
import { LogIn, Mail } from "lucide-react";

interface CooperationCtaProps {
  inviteEmail: string;
}

export function CooperationCta({ inviteEmail }: CooperationCtaProps) {
  const loginUrl = useMemo(() => {
    if (process.env.NEXT_PUBLIC_APP_ORIGIN) {
      return `${process.env.NEXT_PUBLIC_APP_ORIGIN}/login`;
    }
    if (typeof window !== "undefined") {
      const host = window.location.host.replace(/^app\./, "");
      return `${window.location.protocol}//app.${host}/login`;
    }
    return "/login";
  }, []);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Prośba o zaproszenie do współpracy");
    const body = encodeURIComponent(
      "Cześć,\n\nChciałbym/chciałabym dołączyć do programu współpracy Afiliantka Faceless.\n\nMoje dane:\n- Imię:\n- Email:\n"
    );
    return `mailto:${inviteEmail}?subject=${subject}&body=${body}`;
  }, [inviteEmail]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
      <Link
        href={loginUrl}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-sm font-semibold text-white bg-gradient-to-r from-brand to-teal-500 rounded-xl hover:opacity-90 transition-opacity"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Zaloguj się
      </Link>
      <a
        href={mailtoHref}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] text-sm font-semibold text-brand bg-white border border-brand/30 rounded-xl hover:bg-brand-light transition-colors"
      >
        <Mail className="h-4 w-4" aria-hidden="true" />
        Poproś o zaproszenie
      </a>
    </div>
  );
}
