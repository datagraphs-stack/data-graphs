CREATE TABLE IF NOT EXISTS datagraphs (
  id TEXT PRIMARY KEY,
  envelope TEXT NOT NULL,
  write_token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
