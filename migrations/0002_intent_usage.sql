CREATE TABLE IF NOT EXISTS intent_usage (
  hour_bucket TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL
);
