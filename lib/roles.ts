import { createClient } from "@/lib/supabase/server";
import { createClient as createClientClient } from "@/lib/supabase/client";
import { Role, UserWithRoles, Permission } from "@/types/role";

export async function getUserRoles(userId: string): Promise<Role[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_roles")
    .select(
      `
      role:roles(*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user roles:", error);
    return [];
  }

  return data?.map((item) => item.role).filter(Boolean) || [];
}

// Alternative method using RPC function to bypass RLS issues
export async function getUserRolesSafe(userId: string): Promise<Role[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_user_roles", {
    user_uuid: userId,
  });

  if (error) {
    console.error("Error fetching user roles via RPC:", error);
    return [];
  }

  return data || [];
}

export async function getUserWithRoles(
  userId: string
): Promise<UserWithRoles | null> {
  const supabase = await createClient();

  const { data: userData, error: userError } =
    await supabase.auth.admin.getUserById(userId);

  if (userError || !userData.user) {
    console.error("Error fetching user:", userError);
    return null;
  }

  const roles = await getUserRoles(userId);

  return {
    id: userData.user.id,
    email: userData.user.email || "",
    created_at: userData.user.created_at,
    user_metadata: userData.user.user_metadata || {},
    roles,
  };
}

export async function assignRoleToUser(
  userId: string,
  roleName: string,
  assignedBy?: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get role ID
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();

  if (roleError || !roleData) {
    console.error("Error finding role:", roleError);
    return false;
  }

  // Assign role to user
  const { error: assignError } = await supabase.from("user_roles").insert({
    user_id: userId,
    role_id: roleData.id,
    assigned_by: assignedBy,
  });

  if (assignError) {
    console.error("Error assigning role:", assignError);
    return false;
  }

  return true;
}

export async function removeRoleFromUser(
  userId: string,
  roleName: string
): Promise<boolean> {
  const supabase = await createClient();

  // Get role ID
  const { data: roleData, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", roleName)
    .single();

  if (roleError || !roleData) {
    console.error("Error finding role:", roleError);
    return false;
  }

  // Remove role from user
  const { error: removeError } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role_id", roleData.id);

  if (removeError) {
    console.error("Error removing role:", removeError);
    return false;
  }

  return true;
}

export async function userHasPermission(
  userId: string,
  permission: Permission
): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("user_has_permission", {
    user_uuid: userId,
    permission_name: permission,
  });

  if (error) {
    console.error("Error checking permission:", error);
    return false;
  }

  return data || false;
}

export async function getCurrentUserRoles(): Promise<Role[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  return getUserRoles(user.id);
}

export async function getCurrentUserPermissions(): Promise<Permission[]> {
  const roles = await getCurrentUserRoles();
  const permissions: Permission[] = [];

  roles.forEach((role) => {
    Object.entries(role.permissions).forEach(([key, value]) => {
      if (value && !permissions.includes(key as Permission)) {
        permissions.push(key as Permission);
      }
    });
  });

  return permissions;
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("is_user_admin");

    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }

    return data || false;
  } catch (err) {
    console.error("Error checking admin status:", err);
    return false;
  }
}

export async function isCurrentUserModerator(): Promise<boolean> {
  const roles = await getCurrentUserRoles();
  return roles.some(
    (role) => role.name === "moderator" || role.name === "admin"
  );
}
