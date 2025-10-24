import { Sidebar } from "@/components/panel/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isCurrentUserAdmin } from "@/lib/roles";

export default async function PanelLayout({
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
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isAdmin} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
