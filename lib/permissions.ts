import { createClient } from "@/lib/supabase/server";
import type { Permission } from "@/types/role";

export async function checkPermission(
  permission: Permission
): Promise<{ allowed: boolean; userId?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { allowed: false };

  const { data } = await supabase.rpc("user_has_permission", {
    user_uuid: user.id,
    permission_name: permission,
  });

  return { allowed: !!data, userId: user.id };
}

export async function isAdminOrModerator(): Promise<{
  allowed: boolean;
  userId?: string;
  isAdmin: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { allowed: false, isAdmin: false };

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role:roles(name)")
    .eq("user_id", user.id);

  const roleNames = (roles || [])
    .map((r) => (r.role as unknown as { name: string })?.name)
    .filter(Boolean);

  const isAdmin = roleNames.includes("admin");
  const isMod = roleNames.includes("moderator");

  return { allowed: isAdmin || isMod, userId: user.id, isAdmin };
}
