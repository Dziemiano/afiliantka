-- Add account_opened tracking to offer selections
ALTER TABLE user_offer_selections
  ADD COLUMN IF NOT EXISTS account_opened BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS account_opened_at TIMESTAMPTZ;

-- Add accounts_opened_at tracking to user_onboarding
ALTER TABLE user_onboarding
  ADD COLUMN IF NOT EXISTS accounts_opened_at TIMESTAMPTZ;

-- Expand the status CHECK constraint to include accounts_verified
-- Drop old constraint and recreate with new value
ALTER TABLE user_onboarding DROP CONSTRAINT IF EXISTS user_onboarding_status_check;
ALTER TABLE user_onboarding ADD CONSTRAINT user_onboarding_status_check
  CHECK (status IN (
    'reading_pdf',
    'selecting_offers',
    'completing_requirements',
    'accounts_verified',
    'pending_approval',
    'approved'
  ));

-- Create accounts_verified role if it doesn't exist
INSERT INTO roles (name, description, permissions)
VALUES (
  'accounts_verified',
  'Intermediate role: accounts opened and verified by admin',
  '{"view_files": true, "view_offers": true}'
)
ON CONFLICT (name) DO NOTHING;
