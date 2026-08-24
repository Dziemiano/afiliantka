-- Public website analytics (anonymous visitors)

CREATE TABLE IF NOT EXISTS public_analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  resource_name TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_public_analytics_event_type
  ON public_analytics_events(event_type);

CREATE INDEX IF NOT EXISTS idx_public_analytics_resource
  ON public_analytics_events(resource_type, resource_id);

CREATE INDEX IF NOT EXISTS idx_public_analytics_created_at
  ON public_analytics_events(created_at DESC);

ALTER TABLE public_analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read public analytics" ON public_analytics_events;
CREATE POLICY "Admins can read public analytics" ON public_analytics_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
  );
