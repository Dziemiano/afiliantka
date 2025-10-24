"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { UserWithRoles, Role } from "@/types/role";

export async function sendInvitation(
  email: string
): Promise<{ error?: { message: string } }> {
  const supabase = await createAdminClient();

  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email);

    if (error) {
      console.error("Error sending invitation:", error);
      return { error: { message: error.message } };
    }

    return {};
  } catch (error) {
    console.error("Error in sendInvitation:", error);
    return { error: { message: "Failed to send invitation" } };
  }
}

export async function getUsersWithRoles(): Promise<UserWithRoles[]> {
  const supabase = await createAdminClient();

  try {
    // Get all users using admin API
    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return [];
    }

    if (!usersData.users) {
      console.log("No users found in auth");
      return [];
    }

    console.log(`Found ${usersData.users.length} users in auth`);

    // Get roles for each user
    const usersWithRoles = await Promise.all(
      usersData.users.map(async (user) => {
        console.log(`Processing user: ${user.email} (${user.id})`);

        const { data: userRoles, error: rolesError } = await supabase
          .from("user_roles")
          .select(
            `
            role:roles(*)
          `
          )
          .eq("user_id", user.id);

        if (rolesError) {
          console.error(
            `Error fetching roles for user ${user.email}:`,
            rolesError
          );
        }

        const roles = userRoles?.map((ur) => ur.role).filter(Boolean) || [];
        console.log(
          `User ${user.email} has ${roles.length} roles:`,
          roles.map((r) => (r as any)?.name || "unknown")
        );

        return {
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
          user_metadata: user.user_metadata || {},
          roles: roles as unknown as Role[],
        };
      })
    );

    console.log(`Returning ${usersWithRoles.length} users with roles`);
    return usersWithRoles;
  } catch (error) {
    console.error("Error in getUsersWithRoles:", error);
    return [];
  }
}

export async function assignRoleToUser(
  userId: string,
  roleName: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createAdminClient();

  try {
    // Get role ID
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleError || !roleData) {
      return { success: false, error: "Role not found" };
    }

    // Assign role to user
    const { error: assignError } = await supabase.from("user_roles").insert({
      user_id: userId,
      role_id: roleData.id,
    });

    if (assignError) {
      console.error("Error assigning role:", assignError);
      return { success: false, error: "Failed to assign role" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in assignRoleToUser:", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function removeRoleFromUser(
  userId: string,
  roleName: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createAdminClient();

  try {
    // Get role ID
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", roleName)
      .single();

    if (roleError || !roleData) {
      return { success: false, error: "Role not found" };
    }

    // Remove role from user
    const { error: removeError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role_id", roleData.id);

    if (removeError) {
      console.error("Error removing role:", removeError);
      return { success: false, error: "Failed to remove role" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in removeRoleFromUser:", error);
    return { success: false, error: "An error occurred" };
  }
}

export async function getRoles() {
  const supabase = await createAdminClient();

  try {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching roles:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getRoles:", error);
    return [];
  }
}

// Function to assign onboard role to users who don't have any roles
export async function assignOnboardRoleToUsersWithoutRoles(): Promise<{
  success: boolean;
  assigned: number;
  error?: string;
}> {
  const supabase = await createAdminClient();

  try {
    // Get all users
    const { data: usersData, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return { success: false, assigned: 0, error: "Failed to fetch users" };
    }

    if (!usersData.users) {
      return { success: true, assigned: 0 };
    }

    // Get onboard role ID
    const { data: onboardRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "onboard")
      .single();

    if (roleError || !onboardRole) {
      console.error("Error fetching onboard role:", roleError);
      return { success: false, assigned: 0, error: "Onboard role not found" };
    }

    let assignedCount = 0;

    // Check each user and assign onboard role if they have no roles
    for (const user of usersData.users) {
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id);

      // If user has no roles, assign onboard role
      if (!userRoles || userRoles.length === 0) {
        const { error: assignError } = await supabase
          .from("user_roles")
          .insert({
            user_id: user.id,
            role_id: onboardRole.id,
            assigned_at: new Date().toISOString(),
          });

        if (assignError) {
          console.error(
            `Error assigning onboard role to user ${user.email}:`,
            assignError
          );
        } else {
          assignedCount++;
          console.log(`Assigned onboard role to user: ${user.email}`);
        }
      }
    }

    return { success: true, assigned: assignedCount };
  } catch (error) {
    console.error("Error in assignOnboardRoleToUsersWithoutRoles:", error);
    return { success: false, assigned: 0, error: "An error occurred" };
  }
}

// Debug function to check database state
export async function debugDatabaseState() {
  const supabase = await createAdminClient();

  try {
    console.log("=== DEBUG: Database State ===");

    // Check roles table
    const { data: roles, error: rolesError } = await supabase
      .from("roles")
      .select("*");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
    } else {
      console.log(`Roles table has ${roles?.length || 0} entries:`, roles);
    }

    // Check user_roles table
    const { data: userRoles, error: userRolesError } = await supabase
      .from("user_roles")
      .select("*");

    if (userRolesError) {
      console.error("Error fetching user_roles:", userRolesError);
    } else {
      console.log(
        `User_roles table has ${userRoles?.length || 0} entries:`,
        userRoles
      );
    }

    // Check auth users
    const { data: authUsers, error: authError } =
      await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching auth users:", authError);
    } else {
      console.log(
        `Auth has ${authUsers?.users?.length || 0} users:`,
        authUsers?.users?.map((u) => ({
          email: u.email,
          id: u.id,
          email_confirmed_at: u.email_confirmed_at,
        }))
      );
    }

    return {
      roles: roles || [],
      userRoles: userRoles || [],
      authUsers: authUsers?.users || [],
    };
  } catch (error) {
    console.error("Error in debugDatabaseState:", error);
    return null;
  }
}
