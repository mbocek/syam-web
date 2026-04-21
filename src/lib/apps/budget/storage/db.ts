import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { Category, ParsedTransaction, Rule, Transaction, Workspace } from '../types';
import { SCHEMA_V1_SQL, SCHEMA_VERSION } from './schema';
import { KNOWN_SEED_NAMES, SEED_META } from '../categories/seed';
import { matchingRule } from '../rules/engine';
import { todayIso } from '../utils/date';

/** Resolves a seed category key to the user's locale-specific display name. */
export type SeedNameResolver = (key: string) => string;

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({ locateFile: () => sqlWasmUrl });
  }
  return sqlJsPromise;
}

/** Initialise an empty database with schema + localised seed categories. */
export async function createEmptyDb(resolveName: SeedNameResolver): Promise<Database> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database();
  db.exec(SCHEMA_V1_SQL);
  db.run('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)', ['schema_version', String(SCHEMA_VERSION)]);
  ensureSeedCategories(db, resolveName);
  return db;
}

/**
 * Reconcile the DB's category rows with the current seed list.
 *
 * For each seed key we either:
 *   - find a canonical row by any known localised name and UPDATE the
 *     name to the current locale, or
 *   - INSERT a fresh row in the current locale.
 *
 * Also heals rows whose name is a stray `apps.budget.seed.*` i18n key
 * (inserted when the seed landed before its translation was shipped):
 *   - if a proper row already exists, transactions/rules are reassigned
 *     to it and the stray row is deleted;
 *   - otherwise the stray row is renamed to the current locale.
 *
 * Safe to call on every open. Returns the number of rows touched.
 */
export function ensureSeedCategories(db: Database, resolveName: SeedNameResolver): number {
  type Row = { id: number; name: string };
  const res = db.exec('SELECT id, name FROM categories')[0];
  const allRows: Row[] = ((res?.values ?? []) as [number, string][]).map(([id, name]) => ({
    id,
    name
  }));

  let changes = 0;
  // Track which row ids still exist so subsequent seed keys don't reuse
  // ones we've deleted.
  const liveRows = new Map<number, Row>(allRows.map((r) => [r.id, r]));

  for (const meta of SEED_META) {
    const targetName = resolveName(meta.key);
    const rawKey = `apps.budget.seed.${meta.key}`;
    const canonicalNamesLc = new Set(
      [...(KNOWN_SEED_NAMES[meta.key] ?? []), targetName].map((n) => n.toLowerCase())
    );

    let canonical: Row | undefined;
    let stray: Row | undefined;
    for (const r of liveRows.values()) {
      const lc = r.name.toLowerCase();
      if (!stray && lc === rawKey.toLowerCase()) stray = r;
      else if (!canonical && canonicalNamesLc.has(lc)) canonical = r;
    }

    if (stray && canonical) {
      // Both exist — merge the stray row into the canonical one.
      db.run('UPDATE transactions SET category_id = ? WHERE category_id = ?', [canonical.id, stray.id]);
      db.run('UPDATE rules SET category_id = ? WHERE category_id = ?', [canonical.id, stray.id]);
      db.run('DELETE FROM categories WHERE id = ?', [stray.id]);
      liveRows.delete(stray.id);
      changes++;
    } else if (stray) {
      // Only the stray row exists — rename it to the current locale.
      db.run('UPDATE categories SET name = ? WHERE id = ?', [targetName, stray.id]);
      stray.name = targetName;
      canonical = stray;
      changes++;
    }

    if (canonical) {
      if (canonical.name !== targetName) {
        db.run('UPDATE categories SET name = ? WHERE id = ?', [targetName, canonical.id]);
        canonical.name = targetName;
        changes++;
      }
    } else {
      const insert = db.prepare(
        'INSERT INTO categories (name, color, icon, monthly_budget_cents, kind) VALUES (?, ?, ?, ?, ?)'
      );
      insert.run([targetName, meta.color, meta.icon, meta.monthlyBudgetCents, meta.kind]);
      insert.free();
      changes++;
    }
  }

  return changes;
}

/** Load a database from raw bytes (e.g. a file the user opened). */
export async function openDb(bytes: Uint8Array): Promise<Database> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database(bytes);

  const versionRow = db.exec("SELECT value FROM meta WHERE key = 'schema_version'")[0];
  const version = versionRow ? parseInt(versionRow.values[0][0] as string, 10) : 0;
  if (version > SCHEMA_VERSION) {
    db.close();
    throw new Error(
      `Database schema is version ${version}, but this app only supports up to ${SCHEMA_VERSION}. Please update the app.`
    );
  }
  // Migrations for older versions would go here. Schema is currently v1-only.
  return db;
}

export function serializeDb(db: Database): Uint8Array {
  return db.export();
}

/** Snapshot the whole DB into plain JS objects (for reactive views). */
export function readWorkspace(db: Database): Workspace {
  return {
    schemaVersion: SCHEMA_VERSION,
    categories: readCategories(db),
    transactions: readTransactions(db),
    rules: readRules(db)
  };
}

function readCategories(db: Database): Category[] {
  const res = db.exec(
    'SELECT id, name, color, icon, monthly_budget_cents, kind FROM categories ORDER BY kind DESC, name'
  );
  if (!res[0]) return [];
  return res[0].values.map((r) => ({
    id: r[0] as number,
    name: r[1] as string,
    color: r[2] as string,
    icon: r[3] as string,
    monthlyBudgetCents: (r[4] as number | null) ?? null,
    kind: r[5] as Category['kind']
  }));
}

function readTransactions(db: Database): Transaction[] {
  const res = db.exec(
    'SELECT id, date, amount_cents, currency, description, merchant, category_id, import_hash FROM transactions ORDER BY date DESC, id DESC'
  );
  if (!res[0]) return [];
  return res[0].values.map((r) => ({
    id: r[0] as number,
    date: r[1] as string,
    amountCents: r[2] as number,
    currency: r[3] as Transaction['currency'],
    description: r[4] as string,
    merchant: (r[5] as string | null) ?? null,
    categoryId: (r[6] as number | null) ?? null,
    importHash: r[7] as string
  }));
}

function readRules(db: Database): Rule[] {
  const res = db.exec('SELECT id, match, category_id, hit_count, created_at FROM rules ORDER BY id');
  if (!res[0]) return [];
  return res[0].values.map((r) => ({
    id: r[0] as number,
    match: r[1] as string,
    categoryId: r[2] as number,
    hitCount: r[3] as number,
    createdAt: r[4] as string
  }));
}

/** Insert a batch of parsed transactions, skipping rows whose hash already
 * exists. Returns how many rows were actually inserted. */
export function insertTransactions(db: Database, parsed: ParsedTransaction[]): number {
  let inserted = 0;
  const stmt = db.prepare(
    `INSERT OR IGNORE INTO transactions
     (date, amount_cents, currency, description, merchant, category_id, import_hash)
     VALUES (?, ?, ?, ?, ?, NULL, ?)`
  );
  db.exec('BEGIN');
  try {
    for (const t of parsed) {
      stmt.run([t.date, t.amountCents, t.currency, t.description, t.merchant, t.importHash]);
      if (db.getRowsModified() > 0) inserted++;
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  } finally {
    stmt.free();
  }
  return inserted;
}

export function assignCategory(db: Database, transactionId: number, categoryId: number | null): void {
  db.run('UPDATE transactions SET category_id = ? WHERE id = ?', [categoryId, transactionId]);
}

export function insertCategory(
  db: Database,
  data: { name: string; kind: Category['kind']; monthlyBudgetCents: number | null; color?: string; icon?: string }
): number {
  db.run(
    'INSERT INTO categories (name, color, icon, monthly_budget_cents, kind) VALUES (?, ?, ?, ?, ?)',
    [data.name, data.color ?? 'gray', data.icon ?? 'circle', data.monthlyBudgetCents, data.kind]
  );
  const row = db.exec('SELECT last_insert_rowid()')[0];
  return (row?.values[0]?.[0] as number) ?? -1;
}

export function updateCategory(
  db: Database,
  id: number,
  data: { name: string; kind: Category['kind']; monthlyBudgetCents: number | null }
): void {
  db.run('UPDATE categories SET name = ?, kind = ?, monthly_budget_cents = ? WHERE id = ?', [
    data.name,
    data.kind,
    data.monthlyBudgetCents,
    id
  ]);
}

export function deleteCategory(db: Database, id: number): void {
  db.run('DELETE FROM categories WHERE id = ?', [id]);
}

export function addRule(db: Database, match: string, categoryId: number): void {
  db.run('INSERT INTO rules (match, category_id, hit_count, created_at) VALUES (?, ?, 0, ?)', [
    match,
    categoryId,
    todayIso()
  ]);
}

export function deleteRule(db: Database, ruleId: number): void {
  db.run('DELETE FROM rules WHERE id = ?', [ruleId]);
}

/**
 * Scan every uncategorised transaction once and assign the first matching
 * rule's category. Uses `matchingRule` from the engine module so the
 * matching logic is the exact same one covered by the engine unit tests,
 * and bumps each rule's `hit_count` by how many transactions it tagged.
 */
export function applyRulesToUncategorized(db: Database, rules: Rule[]): number {
  const usable = rules.filter((r) => r.match && r.match.trim().length > 0);
  if (usable.length === 0) return 0;

  const res = db.exec(
    `SELECT id, description, COALESCE(merchant, '') AS merchant
     FROM transactions
     WHERE category_id IS NULL`
  )[0];
  if (!res || res.values.length === 0) return 0;

  const assignments: Array<[number, number]> = [];
  const hitsByRule = new Map<number, number>();
  for (const row of res.values) {
    const [id, description, merchant] = row as [number, string, string];
    const rule = matchingRule({ description, merchant: merchant || null }, usable);
    if (!rule) continue;
    assignments.push([id, rule.categoryId]);
    hitsByRule.set(rule.id, (hitsByRule.get(rule.id) ?? 0) + 1);
  }

  if (assignments.length === 0) return 0;

  const updateTxn = db.prepare('UPDATE transactions SET category_id = ? WHERE id = ?');
  const bumpRule = db.prepare('UPDATE rules SET hit_count = hit_count + ? WHERE id = ?');
  db.exec('BEGIN');
  try {
    for (const [id, categoryId] of assignments) {
      updateTxn.run([categoryId, id]);
    }
    for (const [ruleId, count] of hitsByRule) {
      bumpRule.run([count, ruleId]);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  } finally {
    updateTxn.free();
    bumpRule.free();
  }
  return assignments.length;
}
