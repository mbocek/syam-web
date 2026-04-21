/**
 * Core domain types.
 * Amount is stored as an integer in the smallest currency unit (cents)
 * to avoid floating-point accumulation errors.
 */

export type Currency = 'EUR' | 'USD' | 'CZK' | 'PLN';

export type TransactionKind = 'expense' | 'income' | 'transfer';

/** A parsed, normalized transaction. */
export interface Transaction {
  id: number;
  /** ISO 8601 date (YYYY-MM-DD). */
  date: string;
  /** Signed integer in cents. Negative = money out, positive = money in. */
  amountCents: number;
  currency: Currency;
  /** Free-form description from bank feed. */
  description: string;
  /** Parsed merchant name when the parser could extract one. */
  merchant: string | null;
  /** Category id, null when not yet triaged. */
  categoryId: number | null;
  /** Stable hash of the raw row for idempotent imports. */
  importHash: string;
}

/** A normalized transaction as produced by a bank parser, before it has an id. */
export type ParsedTransaction = Omit<Transaction, 'id' | 'categoryId'>;

export interface Category {
  id: number;
  name: string;
  /** Tailwind color class fragment, e.g. "emerald" or "amber". */
  color: string;
  /** Icon name from lucide. */
  icon: string;
  /** Monthly target in cents. null = no target. */
  monthlyBudgetCents: number | null;
  kind: 'expense' | 'income' | 'savings';
}

/** A classification rule: "if description matches X, assign category Y". */
export interface Rule {
  id: number;
  /** Plain-text substring or simple glob (case-insensitive). */
  match: string;
  categoryId: number;
  /** Number of transactions this rule has auto-tagged. */
  hitCount: number;
  createdAt: string;
}

/** Container for the whole workspace loaded from the user's budget.db. */
export interface Workspace {
  schemaVersion: number;
  transactions: Transaction[];
  categories: Category[];
  rules: Rule[];
}
