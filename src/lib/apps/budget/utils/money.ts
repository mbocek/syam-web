/**
 * Parse a human-formatted amount string into integer cents.
 * Handles both "," and "." as the decimal separator and tolerates spaces
 * (including NBSP) as thousand separators. Accepts a leading sign.
 *
 * Throws when the input is empty or does not resemble a number.
 */
export function parseAmountToCents(raw: string): number {
  if (!raw) throw new Error('Empty amount');

  let s = raw.trim().replace(/[\s  ]/g, '');
  if (!s) throw new Error('Empty amount');

  // Detect decimal separator: last occurrence of `,` or `.`.
  const lastComma = s.lastIndexOf(',');
  const lastDot = s.lastIndexOf('.');
  const decimalAt = Math.max(lastComma, lastDot);

  let integerPart: string;
  let fractionalPart: string;
  if (decimalAt === -1) {
    integerPart = s;
    fractionalPart = '';
  } else {
    integerPart = s.slice(0, decimalAt);
    fractionalPart = s.slice(decimalAt + 1);
  }

  // Strip the other separator (thousands grouping).
  integerPart = integerPart.replace(/[.,]/g, '');

  if (!/^-?\d+$/.test(integerPart)) throw new Error(`Invalid amount: ${raw}`);
  if (fractionalPart && !/^\d+$/.test(fractionalPart)) throw new Error(`Invalid amount: ${raw}`);

  const cents = fractionalPart.padEnd(2, '0').slice(0, 2);
  const sign = integerPart.startsWith('-') ? -1 : 1;
  const intAbs = integerPart.replace(/^-/, '');

  return sign * (parseInt(intAbs, 10) * 100 + parseInt(cents, 10));
}

/** Format integer cents as a localized string (no currency symbol). */
export function formatCents(cents: number, locale = 'sk-SK'): string {
  return (cents / 100).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
