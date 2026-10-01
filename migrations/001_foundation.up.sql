-- 001_foundation.up.sql
-- Minimal foundation schema: establishes baseline system metadata tracking
-- Domain tables (users, organizations, repositories, test runs) are deferred to subsequent milestones.

CREATE TABLE IF NOT EXISTS system_metadata (
  key VARCHAR(128) PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO system_metadata (key, value)
VALUES ('schema_version', '1')
ON CONFLICT (key) DO NOTHING;
