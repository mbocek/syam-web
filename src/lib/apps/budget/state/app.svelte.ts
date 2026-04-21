import type { Database } from 'sql.js';
import type { ParsedTransaction, Workspace } from '../types';
import type { Category } from '../types';
import {
  addRule,
  applyRulesToUncategorized,
  assignCategory,
  createEmptyDb,
  deleteCategory,
  deleteRule,
  ensureSeedCategories,
  insertCategory,
  insertTransactions,
  openDb,
  readWorkspace,
  serializeDb,
  updateCategory
} from '../storage/db';
import {
  clearStoredHandle,
  loadStoredHandle,
  readHandle,
  storeHandle,
  writeHandle
} from '../storage/fsAccess';
import { i18n } from '$lib/stores/language.svelte.js';

/** Resolve a seed category key to its localised name using the current i18n. */
const seedName = (key: string) => i18n.t(`apps.budget.seed.${key}`);

type Status = 'idle' | 'saving' | 'error';

const EMPTY_WORKSPACE: Workspace = {
  schemaVersion: 1,
  categories: [],
  transactions: [],
  rules: []
};

const SAVE_DEBOUNCE_MS = 250;

/**
 * Global app state. One instance is exported; components import it directly.
 * Keeps the open sql.js Database + a plain-object snapshot ("workspace")
 * that components read from. Mutations are funneled through the methods
 * here so the snapshot + disk file stay in sync.
 */
class AppStore {
  handle: FileSystemFileHandle | null = $state(null);
  workspace: Workspace = $state(EMPTY_WORKSPACE);
  isReady = $state(false);
  status: Status = $state('idle');
  lastSavedAt: Date | null = $state(null);
  errorMessage: string | null = $state(null);

  #db: Database | null = null;
  #saveTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Re-localise seed category names when the user switches UI language
    // so the dropdowns and envelope cards pick up the new translations
    // without requiring a reload.
    $effect.root(() => {
      $effect(() => {
        // Track i18n.current; no-op when no DB is open.
        i18n.current;
        if (!this.#db) return;
        const changes = ensureSeedCategories(this.#db, seedName);
        if (changes > 0) {
          this.#refresh();
          this.#scheduleSave();
        }
      });
    });
  }

  /** Try to attach to the previously-used file handle. Returns true on success. */
  async resumeLastSession(): Promise<boolean> {
    const handle = await loadStoredHandle();
    if (!handle) return false;
    try {
      await this.attachHandle(handle, { persist: false });
      return true;
    } catch (e) {
      this.errorMessage = e instanceof Error ? e.message : String(e);
      await clearStoredHandle();
      return false;
    }
  }

  async createNewAt(handle: FileSystemFileHandle): Promise<void> {
    this.#db?.close();
    this.#db = await createEmptyDb(seedName);
    this.handle = handle;
    await storeHandle(handle);
    await this.#persist();
    this.#refresh();
    this.isReady = true;
  }

  async openExisting(handle: FileSystemFileHandle): Promise<void> {
    await this.attachHandle(handle, { persist: true });
  }

  async attachHandle(
    handle: FileSystemFileHandle,
    { persist }: { persist: boolean }
  ): Promise<void> {
    const bytes = await readHandle(handle);
    this.#db?.close();
    this.#db = await openDb(bytes);
    this.handle = handle;
    if (persist) await storeHandle(handle);

    // Top up any seed categories added since this DB was created.
    const added = ensureSeedCategories(this.#db, seedName);
    this.#refresh();
    if (added > 0) this.#scheduleSave();

    this.isReady = true;
  }

  async detach(): Promise<void> {
    if (this.#saveTimer) clearTimeout(this.#saveTimer);
    this.#db?.close();
    this.#db = null;
    this.handle = null;
    this.workspace = EMPTY_WORKSPACE;
    this.isReady = false;
    this.lastSavedAt = null;
    await clearStoredHandle();
  }

  // --- mutations ---

  importTransactions(parsed: ParsedTransaction[]): number {
    this.#requireDb();
    const inserted = insertTransactions(this.#db!, parsed);
    if (inserted > 0) {
      // Auto-categorise the newly inserted rows through every saved rule.
      const rules = readWorkspace(this.#db!).rules;
      if (rules.length > 0) applyRulesToUncategorized(this.#db!, rules);
    }
    this.#refresh();
    void this.forceSave();
    return inserted;
  }

  setCategory(transactionId: number, categoryId: number | null): void {
    this.#requireDb();
    assignCategory(this.#db!, transactionId, categoryId);
    this.#refresh();
    this.#scheduleSave();
  }

  addCategory(data: {
    name: string;
    kind: Category['kind'];
    monthlyBudgetCents: number | null;
  }): number {
    this.#requireDb();
    const id = insertCategory(this.#db!, data);
    this.#refresh();
    void this.forceSave();
    return id;
  }

  updateCategory(
    id: number,
    data: { name: string; kind: Category['kind']; monthlyBudgetCents: number | null }
  ): void {
    this.#requireDb();
    updateCategory(this.#db!, id, data);
    this.#refresh();
    void this.forceSave();
  }

  deleteCategory(id: number): void {
    this.#requireDb();
    deleteCategory(this.#db!, id);
    this.#refresh();
    void this.forceSave();
  }

  addRuleFor(match: string, categoryId: number, applyToExisting = true): number {
    this.#requireDb();
    addRule(this.#db!, match, categoryId);
    let applied = 0;
    if (applyToExisting) {
      const rules = readWorkspace(this.#db!).rules;
      applied = applyRulesToUncategorized(this.#db!, rules);
    }
    this.#refresh();
    void this.forceSave();
    return applied;
  }

  deleteRule(ruleId: number): void {
    this.#requireDb();
    deleteRule(this.#db!, ruleId);
    this.#refresh();
    void this.forceSave();
  }

  reapplyAllRules(): number {
    this.#requireDb();
    const updated = applyRulesToUncategorized(this.#db!, this.workspace.rules);
    this.#refresh();
    void this.forceSave();
    return updated;
  }

  async forceSave(): Promise<void> {
    if (this.#saveTimer) {
      clearTimeout(this.#saveTimer);
      this.#saveTimer = null;
    }
    await this.#persist();
  }

  // --- internals ---

  #requireDb(): void {
    if (!this.#db) throw new Error('No workspace is open');
  }

  #refresh(): void {
    if (!this.#db) return;
    this.workspace = readWorkspace(this.#db);
  }

  #scheduleSave(): void {
    if (!this.handle || !this.#db) return;
    if (this.#saveTimer) clearTimeout(this.#saveTimer);
    this.#saveTimer = setTimeout(() => this.#persist(), SAVE_DEBOUNCE_MS);
  }

  async #persist(): Promise<void> {
    if (!this.handle || !this.#db) return;
    this.status = 'saving';
    try {
      const bytes = serializeDb(this.#db);
      await writeHandle(this.handle, bytes);
      this.lastSavedAt = new Date();
      this.status = 'idle';
      this.errorMessage = null;
    } catch (e) {
      this.status = 'error';
      this.errorMessage = e instanceof Error ? e.message : String(e);
    }
  }
}

export const app = new AppStore();
