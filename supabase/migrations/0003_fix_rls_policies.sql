-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_roles;

-- Create a simpler approach: allow service role to bypass RLS for admin operations
-- and create a more specific policy for regular users

-- Allow service role (used by server-side operations) to manage all user roles
CREATE POLICY "Service role can manage all user roles" ON user_roles FOR ALL 
USING (auth.role() = 'service_role');

-- Allow users to view their own roles
CREATE POLICY "Users can view their own roles" ON user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- For now, allow authenticated users to manage roles (we'll restrict this later with application logic)
-- This prevents the recursion issue while we set up the initial admin user
CREATE POLICY "Authenticated users can manage roles" ON user_roles FOR ALL 
USING (auth.role() = 'authenticated');

-- Create a function to safely check if user is admin (for application use)
CREATE OR REPLACE FUNCTION is_user_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid
    AND r.name = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_roles TO authenticated;
