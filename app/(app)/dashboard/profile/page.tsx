"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Calendar,
  Clock,
  CheckCircle2,
  Loader2,
  Mail,
  Activity,
} from "lucide-react";

interface ProfileData {
  user: {
    id: string;
    email: string;
    created_at: string;
    last_sign_in_at: string | null;
    user_metadata?: { full_name?: string };
  };
  roles: Array<{ name: string; description: string }>;
  onboarding: {
    status: string;
    created_at: string;
    approved_at: string | null;
  } | null;
  activity_count: number;
}

const STATUS_LABELS: Record<string, string> = {
  reading_pdf: "Czytanie materiałów",
  selecting_offers: "Wybieranie ofert",
  completing_requirements: "Realizacja wymagań",
  accounts_verified: "Konta zweryfikowane",
  pending_approval: "Oczekiwanie na zatwierdzenie",
  approved: "Zatwierdzony",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        setProfile(await res.json());
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-4 text-red-500">
        Błąd ładowania profilu.
      </div>
    );
  }

  const { user, roles, onboarding, activity_count } = profile;
  const fullName = user.user_metadata?.full_name;
  const initial = fullName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Twój profil</h1>

      {/* User info card */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl sm:text-2xl font-bold">{initial}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-stone-900 truncate">
              {fullName || user.email}
            </h2>
            {fullName && (
              <p className="text-sm text-stone-500">{user.email}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              {roles.map((r) => (
                <span
                  key={r.name}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                >
                  <Shield className="h-3 w-3" />
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value={user.email}
          />
          <InfoRow
            icon={<Calendar className="h-4 w-4" />}
            label="Konto utworzone"
            value={formatDate(user.created_at)}
          />
          <InfoRow
            icon={<Clock className="h-4 w-4" />}
            label="Ostatnie logowanie"
            value={
              user.last_sign_in_at
                ? formatDate(user.last_sign_in_at)
                : "—"
            }
          />
          <InfoRow
            icon={<Activity className="h-4 w-4" />}
            label="Akcje"
            value={`${activity_count} zarejestrowanych`}
          />
        </div>
      </div>

      {/* Roles card */}
      <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-4">
          Role i uprawnienia
        </h3>
        {roles.length === 0 ? (
          <p className="text-sm text-stone-500">Brak przypisanych ról.</p>
        ) : (
          <div className="space-y-3">
            {roles.map((r) => (
              <div
                key={r.name}
                className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg"
              >
                <Shield className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-stone-800 capitalize">
                    {r.name}
                  </p>
                  {r.description && (
                    <p className="text-xs text-stone-500">{r.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Onboarding status card */}
      {onboarding && (
        <div className="bg-white border border-stone-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wider mb-4">
            Status onboardingu
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {onboarding.status === "approved" ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <Clock className="h-5 w-5 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-medium text-stone-800">
                  {STATUS_LABELS[onboarding.status] || onboarding.status}
                </p>
                {onboarding.approved_at && (
                  <p className="text-xs text-stone-500">
                    Zatwierdzono: {formatDate(onboarding.approved_at)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
      <div className="text-stone-400">{icon}</div>
      <div>
        <p className="text-xs text-stone-500">{label}</p>
        <p className="text-sm font-medium text-stone-800 truncate">{value}</p>
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
