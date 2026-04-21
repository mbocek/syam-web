export const SCHEMA_VERSION = 1;

/** Schema v1 — flat, single-user. Adjust only via a numbered migration. */
export const SCHEMA_V1_SQL = `
CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT NOT NULL,
  monthly_budget_cents INTEGER,
  kind TEXT NOT NULL CHECK (kind IN ('expense','income','savings'))
);

CREATE TABLE IF NOT EXISTS rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match TEXT NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  hit_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL,
  description TEXT NOT NULL,
  merchant TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  import_hash TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);
`;
