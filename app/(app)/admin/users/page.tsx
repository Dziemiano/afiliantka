"use client";

import { useState, useEffect } from "react";
import {
  sendInvitation,
  getUsersWithRoles,
  assignRoleToUser,
  removeRoleFromUser,
  getRoles,
  assignOnboardRoleToUsersWithoutRoles,
  getOnboardingStatuses,
  approveOnboarding,
  rejectOffer,
  verifyAccounts,
} from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserWithRoles, Role } from "@/types/role";
import type { UserOnboarding, UserOfferSelection } from "@/types/onboarding";
import {
  CheckCircle2,
  Clock,
  Circle,
  ChevronDown,
  ChevronUp,
  UserCheck,
  XCircle,
  AlertTriangle,
} from "lucide-react";

type OnboardingMap = Record<
  string,
  { onboarding: UserOnboarding; selections: UserOfferSelection[] }
>;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  reading_pdf: {
    label: "Czyta materiały",
    color: "bg-stone-100 text-stone-700",
  },
  selecting_offers: {
    label: "Wybiera oferty",
    color: "bg-blue-100 text-blue-700",
  },
  completing_requirements: {
    label: "Realizuje wymagania",
    color: "bg-amber-100 text-amber-700",
  },
  accounts_verified: {
    label: "Konta zweryfikowane",
    color: "bg-cyan-100 text-cyan-700",
  },
  pending_approval: {
    label: "Czeka na zatwierdzenie",
    color: "bg-orange-100 text-orange-700",
  },
  approved: { label: "Zatwierdzony", color: "bg-green-100 text-green-700" },
};

export default function AdminUsersPage() {
  const [email, setEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [roles, setRoles] = useState<Role[]>([]);
  const [assigningOnboard, setAssigningOnboard] = useState(false);
  const [onboardingMap, setOnboardingMap] = useState<OnboardingMap>({});
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [approvingUser, setApprovingUser] = useState<string | null>(null);
  const [verifyingUser, setVerifyingUser] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [usersData, rolesData, onboardingData] = await Promise.all([
        getUsersWithRoles(),
        getRoles(),
        getOnboardingStatuses(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
      setOnboardingMap(onboardingData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const result = await sendInvitation(email, inviteName);

    if (result.error) {
      setError(result.error.message);
    } else {
      setMessage(`Zaproszenie wysłane do ${email}.`);
      setEmail("");
      setInviteName("");
    }
    setIsLoading(false);
  };

  const handleAssignRole = async (userId: string, roleName: string) => {
    const result = await assignRoleToUser(userId, roleName);
    if (result.success) await fetchData();
  };

  const handleRemoveRole = async (userId: string, roleName: string) => {
    const result = await removeRoleFromUser(userId, roleName);
    if (result.success) await fetchData();
  };

  const handleAssignOnboardToAll = async () => {
    setAssigningOnboard(true);
    const result = await assignOnboardRoleToUsersWithoutRoles();
    if (result.success) {
      alert(`Przypisano rolę onboard do ${result.assigned} użytkowników`);
      await fetchData();
    }
    setAssigningOnboard(false);
  };

  const handleApprove = async (userId: string) => {
    setApprovingUser(userId);
    const result = await approveOnboarding(userId);
    if (result.success) {
      await fetchData();
    } else {
      alert(result.error);
    }
    setApprovingUser(null);
  };

  const handleVerifyAccounts = async (userId: string) => {
    setVerifyingUser(userId);
    const result = await verifyAccounts(userId);
    if (result.success) {
      await fetchData();
    } else {
      alert(result.error);
    }
    setVerifyingUser(null);
  };

  const handleRejectOffer = async (selectionId: string, reason: string) => {
    const result = await rejectOffer(selectionId, reason);
    if (result.success) {
      await fetchData();
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold">Zarządzanie użytkownikami</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invite User Card */}
        <Card className="bg-white border-stone-200">
          <CardHeader>
            <CardTitle className="text-lg text-stone-700">
              Zaproś użytkownika
            </CardTitle>
            <CardDescription>Wyślij zaproszenie na email</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Imię i nazwisko"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="border-stone-300 focus:border-stone-500"
                  disabled={isLoading}
                />
                <Input
                  type="email"
                  placeholder="Email użytkownika"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-stone-300 focus:border-stone-500"
                  disabled={isLoading}
                />
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {message && (
                  <p className="text-green-500 text-sm mt-2">{message}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-stone-600 hover:bg-stone-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Wysyłanie..." : "Wyślij zaproszenie"}
              </Button>
            </form>

            <div className="mt-4 pt-4 border-t border-stone-200">
              <Button
                onClick={handleAssignOnboardToAll}
                disabled={assigningOnboard}
                variant="outline"
                className="w-full text-sm"
              >
                {assigningOnboard
                  ? "Przypisywanie..."
                  : "Przypisz onboard do użytkowników bez roli"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-stone-200">
            <CardHeader>
              <CardTitle className="text-lg text-stone-700">
                Użytkownicy ({users.length})
              </CardTitle>
              <CardDescription>
                Zarządzaj rolami i statusem onboardingu
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <p className="text-stone-500">Ładowanie...</p>
              ) : users.length === 0 ? (
                <p className="text-stone-500">Brak użytkowników</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => {
                    const ob = onboardingMap[user.id];
                    const expanded = expandedUser === user.id;
                    const isPendingApproval =
                      ob?.onboarding?.status === "pending_approval";
                    const allAccountsOpened =
                      ob?.selections?.length === 4 &&
                      ob.selections.every(
                        (s) => s.account_opened
                      ) &&
                      ob.onboarding?.status !== "accounts_verified" &&
                      ob.onboarding?.status !== "pending_approval" &&
                      ob.onboarding?.status !== "approved";

                    return (
                      <div
                        key={user.id}
                        className={`border rounded-lg transition-colors ${
                          isPendingApproval
                            ? "border-orange-300 bg-orange-50"
                            : "border-stone-200"
                        }`}
                      >
                        <div className="p-3 sm:p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-stone-700 text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                                  {user.email}
                                </p>
                                {ob?.onboarding && (
                                  <OnboardingBadge
                                    status={ob.onboarding.status}
                                  />
                                )}
                              </div>
                              <p className="text-xs text-stone-500 mt-0.5">
                                Dołączył:{" "}
                                {new Date(
                                  user.created_at
                                ).toLocaleDateString("pl-PL")}
                              </p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                {user.roles.map((role) => (
                                  <span
                                    key={role.id}
                                    className="px-2 py-1 text-xs bg-stone-100 text-stone-700 rounded flex items-center gap-1"
                                  >
                                    {role.name}
                                    <button
                                      onClick={() =>
                                        handleRemoveRole(user.id, role.name)
                                      }
                                      className="text-red-500 hover:text-red-700 p-0.5"
                                    >
                                      ×
                                    </button>
                                  </span>
                                ))}
                              </div>
                              {(allAccountsOpened || isPendingApproval) && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {allAccountsOpened && (
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handleVerifyAccounts(user.id)
                                      }
                                      disabled={verifyingUser === user.id}
                                      className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs gap-1 min-h-[36px]"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" />
                                      {verifyingUser === user.id
                                        ? "..."
                                        : "Zweryfikuj konta"}
                                    </Button>
                                  )}
                                  {isPendingApproval && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleApprove(user.id)}
                                      disabled={approvingUser === user.id}
                                      className="bg-green-600 hover:bg-green-700 text-white text-xs gap-1 min-h-[36px]"
                                    >
                                      <UserCheck className="h-3.5 w-3.5" />
                                      {approvingUser === user.id
                                        ? "..."
                                        : "Zatwierdź"}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() =>
                                setExpandedUser(expanded ? null : user.id)
                              }
                              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-400 hover:text-stone-600 flex-shrink-0"
                            >
                              {expanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {expanded && (
                          <div className="px-3 sm:px-4 pb-4 border-t border-stone-200 pt-3 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <span className="text-xs text-stone-500">
                                Przypisz rolę:
                              </span>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignRole(user.id, e.target.value);
                                    e.target.value = "";
                                  }
                                }}
                                className="text-sm sm:text-xs border border-stone-300 rounded px-2 py-2 sm:py-1 min-h-[44px] sm:min-h-0"
                                defaultValue=""
                              >
                                <option value="">Wybierz rolę</option>
                                {roles
                                  .filter(
                                    (role) =>
                                      !user.roles.some(
                                        (ur) => ur.name === role.name
                                      )
                                  )
                                  .map((role) => (
                                    <option key={role.id} value={role.name}>
                                      {role.name}
                                    </option>
                                  ))}
                              </select>
                            </div>

                            {ob?.onboarding && (
                              <div className="bg-stone-50 rounded-lg p-3 space-y-2">
                                <p className="text-xs font-medium text-stone-600 uppercase tracking-wider">
                                  Postęp onboardingu
                                </p>
                                <OnboardingProgress
                                  onboarding={ob.onboarding}
                                  selections={ob.selections}
                                  onReject={handleRejectOffer}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function OnboardingBadge({ status }: { status: string }) {
  const info = STATUS_LABELS[status];
  if (!info) return null;

  const Icon =
    status === "approved"
      ? CheckCircle2
      : status === "pending_approval"
        ? Clock
        : Circle;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-medium ${info.color}`}
    >
      <Icon className="h-3 w-3" />
      {info.label}
    </span>
  );
}

function OnboardingProgress({
  onboarding,
  selections,
  onReject,
}: {
  onboarding: UserOnboarding;
  selections: UserOfferSelection[];
  onReject: (selectionId: string, reason: string) => void;
}) {
  const accountsOpened = selections.filter((s) => s.account_opened).length;
  const completedReqs = selections.filter(
    (s) => s.requirement_completed
  ).length;

  return (
    <div className="space-y-2 text-xs text-stone-600">
      <div className="flex items-center gap-2">
        {onboarding.pdf_acknowledged_at ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-stone-300" />
        )}
        <span>Materiały PDF przeczytane</span>
      </div>

      <div className="flex items-center gap-2">
        {selections.length === 4 ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-stone-300" />
        )}
        <span>Oferty wybrane ({selections.length}/4)</span>
      </div>

      {selections.length > 0 && (
        <div className="pl-5 space-y-2">
          {selections.map((sel) => (
            <OfferSelectionRow
              key={sel.id}
              selection={sel}
              onReject={onReject}
            />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {accountsOpened === 4 && selections.length === 4 ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-stone-300" />
        )}
        <span>Konta otwarte ({accountsOpened}/4)</span>
      </div>

      <div className="flex items-center gap-2">
        {onboarding.status === "accounts_verified" ||
        onboarding.status === "pending_approval" ||
        onboarding.status === "approved" ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-stone-300" />
        )}
        <span>Konta zweryfikowane</span>
      </div>

      <div className="flex items-center gap-2">
        {completedReqs === 4 && selections.length === 4 ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-stone-300" />
        )}
        <span>Wymagania zrealizowane ({completedReqs}/4)</span>
      </div>

      <div className="flex items-center gap-2">
        {onboarding.status === "approved" ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Circle className="h-3.5 w-3.5 text-stone-300" />
        )}
        <span>
          {onboarding.status === "approved"
            ? `Zatwierdzony ${onboarding.approved_at ? new Date(onboarding.approved_at).toLocaleDateString("pl-PL") : ""}`
            : "Zatwierdzenie przez admina"}
        </span>
      </div>
    </div>
  );
}

function OfferSelectionRow({
  selection,
  onReject,
}: {
  selection: UserOfferSelection;
  onReject: (selectionId: string, reason: string) => void;
}) {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setRejecting(true);
    await onReject(selection.id, rejectReason.trim());
    setShowRejectInput(false);
    setRejectReason("");
    setRejecting(false);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {selection.rejection_reason ? (
          <AlertTriangle className="h-3 w-3 text-red-500" />
        ) : selection.requirement_completed ? (
          <CheckCircle2 className="h-3 w-3 text-green-500" />
        ) : (
          <Circle className="h-3 w-3 text-stone-300" />
        )}
        <span
          className={
            selection.requirement_completed && !selection.rejection_reason
              ? "line-through text-stone-400"
              : selection.rejection_reason
                ? "text-red-600"
                : ""
          }
        >
          {selection.offer_name}
        </span>

        <span className="flex items-center gap-1 ml-1">
          <span
            className={`inline-block w-2 h-2 rounded-full ${selection.account_opened ? "bg-blue-500" : "bg-stone-300"}`}
            title={selection.account_opened ? "Konto otwarte" : "Konto nieotwarte"}
          />
          <span
            className={`inline-block w-2 h-2 rounded-full ${selection.requirement_completed && !selection.rejection_reason ? "bg-green-500" : "bg-stone-300"}`}
            title={selection.requirement_completed ? "Wymaganie zrealizowane" : "Wymaganie niezrealizowane"}
          />
        </span>

        {selection.requirement_completed && !selection.rejection_reason && (
          <button
            onClick={() => setShowRejectInput(!showRejectInput)}
            className="ml-auto p-1 min-h-[32px] min-w-[32px] flex items-center justify-center text-red-400 hover:text-red-600 transition-colors"
            title="Odrzuć tę ofertę"
          >
            <XCircle className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {selection.rejection_reason && (
        <p className="pl-5 text-red-500 text-xs">
          Odrzucone: {selection.rejection_reason}
        </p>
      )}

      {showRejectInput && (
        <div className="pl-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Podaj powód odrzucenia..."
            className="flex-1 text-sm sm:text-xs border border-red-300 rounded px-3 py-2 sm:px-2 sm:py-1 focus:outline-none focus:ring-1 focus:ring-red-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleReject();
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={handleReject}
              disabled={rejecting || !rejectReason.trim()}
              className="text-xs px-3 py-2 sm:px-2 sm:py-1 min-h-[36px] bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {rejecting ? "..." : "Odrzuć"}
            </button>
            <button
              onClick={() => {
                setShowRejectInput(false);
                setRejectReason("");
              }}
              className="text-xs px-3 py-2 sm:px-2 sm:py-1 min-h-[36px] text-stone-400 hover:text-stone-600"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
