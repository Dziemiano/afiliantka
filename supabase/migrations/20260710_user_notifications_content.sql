-- User in-app notifications and content release tracking

CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id
  ON user_notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_user_notifications_read
  ON user_notifications(user_id, read);

CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at
  ON user_notifications(created_at DESC);

ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own notifications" ON user_notifications;
CREATE POLICY "Users can read own notifications" ON user_notifications
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own notifications" ON user_notifications;
CREATE POLICY "Users can update own notifications" ON user_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS content_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  content_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  section TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_content_releases_published_at
  ON content_releases(published_at DESC);

ALTER TABLE content_releases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read content releases" ON content_releases;
CREATE POLICY "Authenticated users can read content releases" ON content_releases
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins can manage content releases" ON content_releases;
CREATE POLICY "Admins can manage content releases" ON content_releases
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );

CREATE TABLE IF NOT EXISTS user_content_seen (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_release_id UUID NOT NULL REFERENCES content_releases(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, content_release_id)
);

ALTER TABLE user_content_seen ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own content seen" ON user_content_seen;
CREATE POLICY "Users can manage own content seen" ON user_content_seen
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
