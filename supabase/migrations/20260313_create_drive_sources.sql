-- Create drive_sources table for storing Google Drive folder/file mappings
CREATE TABLE IF NOT EXISTS drive_sources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id TEXT NOT NULL,
  drive_type TEXT NOT NULL CHECK (drive_type IN ('file', 'folder')),
  name TEXT NOT NULL,
  section TEXT,
  role_required TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for quick lookups by section
CREATE INDEX IF NOT EXISTS idx_drive_sources_section ON drive_sources(section);

-- Enable RLS
ALTER TABLE drive_sources ENABLE ROW LEVEL SECURITY;

-- Admins can do everything (uses the existing is_user_admin RPC)
CREATE POLICY "Admins can manage drive_sources"
  ON drive_sources
  FOR ALL
  USING (is_user_admin());

-- Authenticated users can read drive_sources (the app filters by role in code)
CREATE POLICY "Authenticated users can read drive_sources"
  ON drive_sources
  FOR SELECT
  USING (auth.role() = 'authenticated');
