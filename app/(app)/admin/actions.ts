"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { UserWithRoles, Role } from "@/types/role";
import type { UserOnboarding, UserOfferSelection } from "@/types/onboarding";
import { notifyUser } from "@/lib/user-notifications";

async function requireAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("is_user_admin");
  return !!data;
}

export async function sendInvitation(
  email: string,
  name?: string
): Promise<{ error?: { message: string } }> {
  if (!(await requireAdmin())) {
    return { error: { message: "Forbidden" } };
  }
  const supabase = await createAdminClient();

  try {
    const options: Record<string, unknown> = {};
    if (name?.trim()) {
      options.data = { full_name: name.trim() };
    }

    const { error } = await supabase.auth.admin.inviteUserByEmail(email, options);

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
  if (!(await requireAdmin())) return [];
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
      return [];
    }

    const usersWithRoles = await Promise.all(
      usersData.users.map(async (user) => {
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

        return {
          id: user.id,
          email: user.email || "",
          created_at: user.created_at,
          user_metadata: user.user_metadata || {},
          roles: roles as unknown as Role[],
        };
      })
    );

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
  if (!(await requireAdmin())) return { success: false, error: "Forbidden" };
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
  if (!(await requireAdmin())) return { success: false, error: "Forbidden" };
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
        }
      }
    }

    return { success: true, assigned: assignedCount };
  } catch (error) {
    console.error("Error in assignOnboardRoleToUsersWithoutRoles:", error);
    return { success: false, assigned: 0, error: "An error occurred" };
  }
}

export async function getOnboardingStatuses(): Promise<
  Record<string, { onboarding: UserOnboarding; selections: UserOfferSelection[] }>
> {
  const supabase = await createAdminClient();

  const { data: onboardings } = await supabase
    .from("user_onboarding")
    .select("*");

  const { data: allSelections } = await supabase
    .from("user_offer_selections")
    .select("*")
    .order("created_at");

  const result: Record<
    string,
    { onboarding: UserOnboarding; selections: UserOfferSelection[] }
  > = {};

  for (const ob of (onboardings || []) as UserOnboarding[]) {
    result[ob.user_id] = {
      onboarding: ob,
      selections: ((allSelections || []) as UserOfferSelection[]).filter(
        (s) => s.user_id === ob.user_id
      ),
    };
  }

  return result;
}

export async function approveOnboarding(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await requireAdmin())) return { success: false, error: "Forbidden" };
  const supabase = await createAdminClient();

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", userId)
    .single();

  if (!onboarding || onboarding.status !== "pending_approval") {
    return { success: false, error: "Użytkownik nie czeka na zatwierdzenie" };
  }

  await supabase
    .from("user_onboarding")
    .update({
      status: "approved",
      approved_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  // Remove onboard role, add user role
  const { data: onboardRole } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "onboard")
    .single();

  const { data: userRole } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "user")
    .single();

  if (onboardRole) {
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role_id", onboardRole.id);
  }

  if (userRole) {
    await supabase.from("user_roles").upsert(
      { user_id: userId, role_id: userRole.id },
      { onConflict: "user_id,role_id" }
    );
  }

  return { success: true };
}

export async function rejectOffer(
  selectionId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await requireAdmin())) return { success: false, error: "Forbidden" };
  const supabase = await createAdminClient();

  if (!reason?.trim()) {
    return { success: false, error: "Podaj powód odrzucenia" };
  }

  const { data: selection } = await supabase
    .from("user_offer_selections")
    .select("user_id, offer_name")
    .eq("id", selectionId)
    .single();

  if (!selection) {
    return { success: false, error: "Nie znaleziono wyboru oferty" };
  }

  await supabase
    .from("user_offer_selections")
    .update({
      requirement_completed: false,
      completed_at: null,
      rejection_reason: reason.trim(),
      rejected_at: new Date().toISOString(),
    })
    .eq("id", selectionId);

  const { data: onboarding } = await supabase
    .from("user_onboarding")
    .select("status")
    .eq("user_id", selection.user_id)
    .single();

  if (onboarding?.status === "pending_approval") {
    await supabase
      .from("user_onboarding")
      .update({
        status: "completing_requirements",
        requirements_completed_at: null,
      })
      .eq("user_id", selection.user_id);
  }

  return { success: true };
}

export async function verifyAccounts(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!(await requireAdmin())) return { success: false, error: "Forbidden" };
  const supabase = await createAdminClient();

  const { data: selections } = await supabase
    .from("user_offer_selections")
    .select("account_opened")
    .eq("user_id", userId);

  const allOpened =
    selections &&
    selections.length === 4 &&
    selections.every((s) => s.account_opened);

  if (!allOpened) {
    return { success: false, error: "Nie wszystkie konta zostały otwarte" };
  }

  // Assign accounts_verified role
  const { data: role } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "accounts_verified")
    .single();

  if (role) {
    await supabase.from("user_roles").upsert(
      { user_id: userId, role_id: role.id },
      { onConflict: "user_id,role_id" }
    );
  }

  // Update onboarding status
  await supabase
    .from("user_onboarding")
    .update({ status: "accounts_verified" })
    .eq("user_id", userId);

  const { data: verifiedUser } = await supabase.auth.admin.getUserById(userId);

  await notifyUser({
    userId,
    email: verifiedUser?.user?.email,
    type: "onboarding_status",
    title: "Konta zweryfikowane",
    message:
      "Administrator zweryfikował Twoje konta. Możesz teraz przejść do dodatkowych materiałów i dokończyć wymagania.",
    link: "/dashboard/onboarding",
  });

  return { success: true };
}

