/** Parse a date in several common bank-export formats to ISO (YYYY-MM-DD). */
export function parseDateIso(raw: string): string {
  const s = raw.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // DD.MM.YYYY or DD.MM.YY
  let m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (m) {
    const [, d, mo, y] = m;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // DD/MM/YYYY
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  throw new Error(`Unrecognized date format: ${raw}`);
}

/** First day (inclusive) of the month as ISO, based on a YYYY-MM-DD input. */
export function monthStart(isoDate: string): string {
  return `${isoDate.slice(0, 7)}-01`;
}

/** Return YYYY-MM key for a given ISO date. */
export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

/** Return today as ISO YYYY-MM-DD in the local timezone. */
export function todayIso(): string {
  return toIsoDate(new Date());
}

/** Local-timezone ISO date (YYYY-MM-DD). */
export function toIsoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export type Period = 'week' | 'month' | 'year';

/** Monday at 00:00 for the week containing `d`. */
export function startOfWeek(d: Date): Date {
  const out = new Date(d);
  out.setHours(0, 0, 0, 0);
  const day = out.getDay(); // 0 = Sunday
  const delta = (day + 6) % 7; // days since Monday
  out.setDate(out.getDate() - delta);
  return out;
}

export function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const out = new Date(start);
  out.setDate(out.getDate() + 6);
  return out;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

export function startOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 0, 1);
}

export function endOfYear(d: Date): Date {
  return new Date(d.getFullYear(), 11, 31);
}

/** Inclusive ISO-date range for the given period at `anchor`. */
export function periodRange(period: Period, anchor: Date): { startIso: string; endIso: string } {
  const starts = { week: startOfWeek, month: startOfMonth, year: startOfYear };
  const ends = { week: endOfWeek, month: endOfMonth, year: endOfYear };
  return { startIso: toIsoDate(starts[period](anchor)), endIso: toIsoDate(ends[period](anchor)) };
}

/** Shift `anchor` by `delta` units of the current period. */
export function shiftPeriod(period: Period, anchor: Date, delta: number): Date {
  const out = new Date(anchor);
  if (period === 'week') out.setDate(out.getDate() + delta * 7);
  else if (period === 'month') out.setMonth(out.getMonth() + delta);
  else out.setFullYear(out.getFullYear() + delta);
  return out;
}

/** ISO 8601 week number for the given date. */
export function isoWeek(d: Date): number {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  return Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Factor applied to a monthly target to get the period target. Approximate
 * — weeks vary per month but 7/30 is close enough for budget eyeballing.
 */
export const PERIOD_BUDGET_FACTOR: Record<Period, number> = {
  week: 7 / 30,
  month: 1,
  year: 12
};
