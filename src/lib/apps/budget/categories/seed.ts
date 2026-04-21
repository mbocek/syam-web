import type { Category } from '../types';

export interface SeedMeta {
  /** Stable identifier used for dedup across locales. */
  key: string;
  color: string;
  icon: string;
  monthlyBudgetCents: number | null;
  kind: Category['kind'];
}

/**
 * Canonical set of categories inserted on first-run. Users can rename,
 * delete, or add categories afterwards — these are just starting points.
 */
export const SEED_META: readonly SeedMeta[] = [
  { key: 'groceries',     color: 'emerald',  icon: 'shopping-cart',    monthlyBudgetCents: 40000, kind: 'expense' },
  { key: 'dining',        color: 'orange',   icon: 'utensils',         monthlyBudgetCents: 15000, kind: 'expense' },
  { key: 'transport',     color: 'blue',     icon: 'car',              monthlyBudgetCents: 15000, kind: 'expense' },
  { key: 'fuel',          color: 'yellow',   icon: 'fuel',             monthlyBudgetCents: 10000, kind: 'expense' },
  { key: 'housing',       color: 'violet',   icon: 'house',            monthlyBudgetCents: 80000, kind: 'expense' },
  { key: 'utilities',     color: 'sky',      icon: 'zap',              monthlyBudgetCents: 15000, kind: 'expense' },
  { key: 'subscriptions', color: 'pink',     icon: 'repeat',           monthlyBudgetCents: 5000,  kind: 'expense' },
  { key: 'health',        color: 'red',      icon: 'heart-pulse',      monthlyBudgetCents: 5000,  kind: 'expense' },
  { key: 'pets',          color: 'rose',     icon: 'paw-print',        monthlyBudgetCents: 3000,  kind: 'expense' },
  { key: 'clothing',      color: 'fuchsia',  icon: 'shirt',            monthlyBudgetCents: 5000,  kind: 'expense' },
  { key: 'electronics',   color: 'cyan',     icon: 'smartphone',       monthlyBudgetCents: null,  kind: 'expense' },
  { key: 'leisure',       color: 'amber',    icon: 'smile',            monthlyBudgetCents: 10000, kind: 'expense' },
  { key: 'cash',          color: 'slate',    icon: 'wallet',           monthlyBudgetCents: null,  kind: 'expense' },
  { key: 'transfers',     color: 'indigo',   icon: 'arrow-left-right', monthlyBudgetCents: null,  kind: 'expense' },
  { key: 'other',         color: 'gray',     icon: 'circle',           monthlyBudgetCents: null,  kind: 'expense' },
  { key: 'salary',        color: 'emerald',  icon: 'banknote',         monthlyBudgetCents: null,  kind: 'income'  },
  { key: 'otherIncome',   color: 'teal',     icon: 'coins',            monthlyBudgetCents: null,  kind: 'income'  },
  { key: 'savings',       color: 'teal',     icon: 'piggy-bank',       monthlyBudgetCents: 20000, kind: 'savings' }
];

/**
 * Every localised name we have ever shipped for a seed category, across
 * all supported locales. Used to dedup during auto-upgrade so an existing
 * `budget.db` seeded in one language does not get duplicate rows added
 * when the app grows new seeds or the user switches language.
 */
export const KNOWN_SEED_NAMES: Readonly<Record<string, readonly string[]>> = {
  groceries:     ['Groceries', 'Potraviny', 'Potraviny a drogerie'],
  dining:        ['Dining & Cafes', 'Dining', 'Reštaurácie a jedlo', 'Restaurace a jídlo'],
  transport:     ['Transport', 'Doprava'],
  fuel:          ['Fuel', 'Pohonné hmoty'],
  housing:       ['Housing', 'Bývanie', 'Bydlení'],
  utilities:     ['Utilities', 'Energie'],
  subscriptions: ['Subscriptions', 'Predplatné', 'Předplatné'],
  health:        ['Health', 'Zdravie', 'Zdraví'],
  pets:          ['Pets', 'Domáce zvieratá', 'Domácí mazlíčci'],
  clothing:      ['Clothing & Shoes', 'Oblečenie a obuv', 'Oblečení a obuv'],
  electronics:   ['Electronics', 'Elektronika'],
  leisure:       ['Leisure', 'Voľný čas', 'Volný čas'],
  cash:          ['Cash Withdrawal', 'Výber hotovosti', 'Výběr hotovosti'],
  transfers:     ['Transfers', 'Prevody', 'Převody'],
  other:         ['Other', 'Iné', 'Jiné'],
  salary:        ['Salary', 'Mzda'],
  otherIncome:   ['Other Income', 'Iný príjem', 'Jiný příjem'],
  savings:       ['Savings', 'Sporenie', 'Spoření']
};
