import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/roles";

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

  // Check if user has admin role
  const isAdmin = await isCurrentUserAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={isAdmin} user={user} />
      <main className="flex-1 p-8 bg-white">{children}</main>
    </div>
  );
}
