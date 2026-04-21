import type { Rule, Transaction } from '../types';

/**
 * Find the first rule that matches the transaction. Returns the full rule
 * (handy when the caller wants both the category id and the rule id — for
 * example to increment a hit counter), or null when nothing matches.
 * Match is a case-insensitive substring over `description + merchant`.
 */
export function matchingRule(
  txn: Pick<Transaction, 'description' | 'merchant'>,
  rules: Rule[]
): Rule | null {
  const haystack = `${txn.description} ${txn.merchant ?? ''}`.toLowerCase();
  for (const rule of rules) {
    if (!rule.match) continue;
    if (haystack.includes(rule.match.toLowerCase())) return rule;
  }
  return null;
}

/** Shortcut: just the matching rule's category id, or null. */
export function classifyByRules(
  txn: Pick<Transaction, 'description' | 'merchant'>,
  rules: Rule[]
): number | null {
  return matchingRule(txn, rules)?.categoryId ?? null;
}

/** Suggest a rule from a newly-categorized transaction. Returns a candidate
 * match substring that is likely stable across similar future transactions
 * (merchant name, or a salient word from the description). */
export function suggestRuleMatch(txn: Pick<Transaction, 'description' | 'merchant'>): string {
  if (txn.merchant && txn.merchant.length >= 3) return txn.merchant;

  // Fallback: longest alphabetic token in description.
  const tokens = txn.description.split(/\s+/).filter((t) => /^[A-Za-zÀ-ž][A-Za-zÀ-ž0-9.&-]{2,}$/.test(t));
  tokens.sort((a, b) => b.length - a.length);
  return tokens[0] ?? txn.description.slice(0, 20).trim();
}
