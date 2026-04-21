export const MONTH_NAMES = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

/** Returns the i18n key for the given 1-indexed month (1 = January). */
export function monthKey(month) {
  return `month.${MONTH_NAMES[month - 1]}`;
}
