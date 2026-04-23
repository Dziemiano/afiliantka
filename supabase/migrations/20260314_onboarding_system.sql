-- Onboarding progress tracking per user
CREATE TABLE IF NOT EXISTS user_onboarding (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'reading_pdf'
    CHECK (status IN ('reading_pdf', 'selecting_offers', 'completing_requirements', 'pending_approval', 'approved')),
  pdf_acknowledged_at TIMESTAMPTZ,
  offers_selected_at TIMESTAMPTZ,
  requirements_completed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_onboarding_user ON user_onboarding(user_id);
CREATE INDEX IF NOT EXISTS idx_user_onboarding_status ON user_onboarding(status);

ALTER TABLE user_onboarding ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own onboarding" ON user_onboarding;
CREATE POLICY "Users can read own onboarding" ON user_onboarding
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own onboarding" ON user_onboarding;
CREATE POLICY "Users can insert own onboarding" ON user_onboarding
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own onboarding" ON user_onboarding;
CREATE POLICY "Users can update own onboarding" ON user_onboarding
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all onboarding" ON user_onboarding;
CREATE POLICY "Admins can manage all onboarding" ON user_onboarding
  FOR ALL USING (is_user_admin());


-- User offer selections (links Supabase users to Sanity offer IDs)
CREATE TABLE IF NOT EXISTS user_offer_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  offer_sanity_id TEXT NOT NULL,
  offer_slug TEXT NOT NULL,
  offer_name TEXT NOT NULL,
  requirement_text TEXT,
  requirement_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, offer_sanity_id)
);

CREATE INDEX IF NOT EXISTS idx_user_offer_selections_user ON user_offer_selections(user_id);

ALTER TABLE user_offer_selections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own selections" ON user_offer_selections;
CREATE POLICY "Users can read own selections" ON user_offer_selections
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own selections" ON user_offer_selections;
CREATE POLICY "Users can insert own selections" ON user_offer_selections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own selections" ON user_offer_selections;
CREATE POLICY "Users can update own selections" ON user_offer_selections
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage all selections" ON user_offer_selections;
CREATE POLICY "Admins can manage all selections" ON user_offer_selections
  FOR ALL USING (is_user_admin());


-- Admin notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created ON admin_notifications(created_at DESC);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage notifications" ON admin_notifications;
CREATE POLICY "Admins can manage notifications" ON admin_notifications
  FOR ALL USING (is_user_admin());
