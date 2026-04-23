-- Add rejection support to user_offer_selections
ALTER TABLE user_offer_selections
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
  ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;

-- Allow any authenticated user to INSERT admin notifications
-- (the system creates notifications on behalf of users when they complete onboarding)
DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON admin_notifications;
CREATE POLICY "Authenticated users can insert notifications"
  ON admin_notifications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to DELETE their own offer selections
DROP POLICY IF EXISTS "Users can delete own selections" ON user_offer_selections;
CREATE POLICY "Users can delete own selections"
  ON user_offer_selections
  FOR DELETE
  USING (auth.uid() = user_id);
