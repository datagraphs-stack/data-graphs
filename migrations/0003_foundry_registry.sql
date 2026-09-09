-- Additive only: Studio tables and historical evidence are untouched.
CREATE TABLE IF NOT EXISTS foundry_sources (
  source_id TEXT PRIMARY KEY,
  origin TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','active','paused','blocked')),
  policy_note TEXT NOT NULL,
  policy_revision INTEGER NOT NULL DEFAULT 1 CHECK(policy_revision >= 1),
  refresh_seconds INTEGER NOT NULL CHECK(refresh_seconds BETWEEN 3600 AND 2592000),
  created_at_ms INTEGER NOT NULL CHECK(created_at_ms >= 0),
  updated_at_ms INTEGER NOT NULL CHECK(updated_at_ms >= created_at_ms),
  next_fetch_at_ms INTEGER NOT NULL CHECK(next_fetch_at_ms >= 0),
  lease_token TEXT,
  lease_expires_at_ms INTEGER,
  CHECK((lease_token IS NULL AND lease_expires_at_ms IS NULL) OR (lease_token IS NOT NULL AND lease_expires_at_ms IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS foundry_sources_due ON foundry_sources(status, next_fetch_at_ms, source_id);
CREATE TABLE IF NOT EXISTS foundry_source_policy_events (
  event_id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES foundry_sources(source_id),
  policy_revision INTEGER NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('pending','active','paused','blocked')),
  note TEXT NOT NULL,
  refresh_seconds INTEGER NOT NULL,
  recorded_at_ms INTEGER NOT NULL,
  UNIQUE(source_id, policy_revision)
);
