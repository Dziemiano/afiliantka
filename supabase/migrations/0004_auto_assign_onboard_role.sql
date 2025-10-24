-- Create function to automatically assign onboard role to new users
CREATE OR REPLACE FUNCTION assign_onboard_role_to_new_user()
RETURNS TRIGGER AS $$
DECLARE
  onboard_role_id UUID;
BEGIN
  -- Get the onboard role ID
  SELECT id INTO onboard_role_id 
  FROM roles 
  WHERE name = 'onboard';
  
  -- If onboard role exists, assign it to the new user
  IF onboard_role_id IS NOT NULL THEN
    INSERT INTO user_roles (user_id, role_id, assigned_at)
    VALUES (NEW.id, onboard_role_id, NOW());
    
    RAISE NOTICE 'Assigned onboard role to new user: %', NEW.email;
  ELSE
    RAISE WARNING 'Onboard role not found, cannot assign to new user: %', NEW.email;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign onboard role when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION assign_onboard_role_to_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION assign_onboard_role_to_new_user() TO service_role;
