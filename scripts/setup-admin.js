// Script to set up the initial admin user
// Run this after creating the first user account

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAdmin() {
  try {
    // Get the first user (assuming it's the admin)
    const { data: users, error: usersError } =
      await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return;
    }

    if (users.users.length === 0) {
      console.log("No users found. Please create a user account first.");
      return;
    }

    const firstUser = users.users[0];
    console.log(`Setting up admin for user: ${firstUser.email}`);

    // Get the admin role
    const { data: adminRole, error: roleError } = await supabase
      .from("roles")
      .select("id")
      .eq("name", "admin")
      .single();

    if (roleError) {
      console.error("Error fetching admin role:", roleError);
      return;
    }

    // Assign admin role to the first user
    const { error: assignError } = await supabase.from("user_roles").insert({
      user_id: firstUser.id,
      role_id: adminRole.id,
    });

    if (assignError) {
      console.error("Error assigning admin role:", assignError);
      return;
    }

    console.log("✅ Admin role assigned successfully!");
    console.log(`User ${firstUser.email} is now an admin.`);
  } catch (error) {
    console.error("Error setting up admin:", error);
  }
}

setupAdmin();
