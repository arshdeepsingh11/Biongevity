-- Biongevity forms database (Cloudflare D1). Apply once, from deploy/forms/:
--   npx wrangler d1 execute biongevity-forms --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS enquiries (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,              -- ISO 8601, UTC
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL DEFAULT '',
  interest   TEXT NOT NULL DEFAULT '',
  message    TEXT NOT NULL,
  routed     TEXT NOT NULL DEFAULT ''    -- the team Biongevity SI suggested on the form
);

-- Admin sign-in state: the last 6-digit code step used, so each code works only once.
CREATE TABLE IF NOT EXISTS admin_state (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
