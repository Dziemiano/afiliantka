import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin, getCurrentUserRoles } from "@/lib/roles";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let isAdmin = false;
  let isModerator = false;
  let isOnboardOnly = false;
  try {
    isAdmin = await isCurrentUserAdmin();
    const roles = await getCurrentUserRoles();
    const roleNames = roles.map((r) => r.name);
    isModerator = roleNames.includes("moderator");
    isOnboardOnly =
      roleNames.includes("onboard") &&
      !roleNames.includes("user") &&
      !roleNames.includes("admin") &&
      !roleNames.includes("moderator");
  } catch (error) {
    console.error("Error checking roles:", error);
  }

  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const allowedOnboardPaths = ["/dashboard/onboarding", "/dashboard/offers"];
  if (
    isOnboardOnly &&
    !allowedOnboardPaths.some((p) => pathname.startsWith(p))
  ) {
    redirect("/dashboard/onboarding");
  }

  return (
    <AppShell
      sidebar={
        <DashboardSidebar
          isAdmin={isAdmin}
          isModerator={isModerator}
          isOnboardOnly={isOnboardOnly}
          user={user}
        />
      }
    >
      {children}
    </AppShell>
  );
}
