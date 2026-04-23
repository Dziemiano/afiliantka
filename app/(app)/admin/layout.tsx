import { AdminSidebar } from "@/components/admin/sidebar";
import { NotificationBell } from "@/components/admin/notification-bell";
import { AppShell } from "@/components/layout/app-shell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin, isCurrentUserModerator } from "@/lib/roles";

export default async function AdminLayout({
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

  const isAdmin = await isCurrentUserAdmin();
  const isModerator = await isCurrentUserModerator();

  if (!isAdmin && !isModerator) {
    redirect("/dashboard");
  }

  return (
    <AppShell
      sidebar={<AdminSidebar isAdmin={isAdmin} />}
      header={isAdmin ? <NotificationBell /> : undefined}
    >
      {children}
    </AppShell>
  );
}
