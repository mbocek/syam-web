import type { BankParser } from './parser';
import type { Currency, ParsedTransaction } from '../types';
import { parseAmountToCents } from '../utils/money';
import { parseDateIso } from '../utils/date';

const VALID_CURRENCIES = ['EUR', 'USD', 'CZK', 'PLN'] as const;

/**
 * Parser for mBank CSV exports (CZ/SK).
 *
 * Real mBank quirks handled here (verified against a live CZ export):
 *   - Windows-1250 encoded (decoder handles upstream in decodeBytes).
 *   - Semicolon-separated with optional quoted fields.
 *   - A long header block (bank address, account list, period, totals) that
 *     precedes the transaction table.
 *   - Transaction header row: `#Datum operace;#Popis operace;#Účet;#Kategorie;#Částka;`
 *     with localised column names that vary between CZ (`Částka`, `Popis operace`)
 *     and SK (`Suma operácie`, `Popis operácie`) exports.
 *   - Amount and currency share one cell, e.g. `-951,12 CZK`.
 *   - The bank's own category (e.g. `Potraviny a drogerie`) is a separate
 *     column. We ignore it here — the app has its own rules engine.
 *   - Description is densely padded: merchant name, two or more spaces,
 *     transaction type (`PLATBA KARTOU`, `VÝBĚR Z BANKOMATU`…), then extra
 *     metadata. Double-space acts as a de-facto sub-delimiter.
 */
export class MBankParser implements BankParser {
  readonly id = 'mbank';
  readonly label = 'mBank';

  sniff(content: string): boolean {
    const head = content.slice(0, 4096).toLowerCase();
    if (head.includes('mbank')) return true;
    return (
      head.includes(';') &&
      (head.includes('datum operace') || head.includes('datum uskuto')) &&
      (head.includes('popis operace') || head.includes('popis operacie') || head.includes('opis operacji'))
    );
  }

  parse(content: string): ParsedTransaction[] {
    const lines = content.split(/\r?\n/);
    const headerIdx = findHeaderRow(lines);
    if (headerIdx === -1) throw new Error('mBank: could not find transaction header row');

    const headers = splitCsvRow(lines[headerIdx]).map(normalizeHeader);
    const col = {
      date: findCol(headers, ['datumoperace', 'datumuskutocneniaoperacie', 'datumuskutecneni', 'datumoperacie']),
      description: findCol(headers, ['popisoperace', 'popisoperacie', 'opisoperacji']),
      amount: findCol(headers, ['castka', 'ciastka', 'sumaoperacie', 'kwota', 'suma'])
    };

    if (col.date === -1 || col.description === -1 || col.amount === -1) {
      throw new Error(`mBank: could not map required columns from header ${JSON.stringify(headers)}`);
    }

    const out: ParsedTransaction[] = [];
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const cells = splitCsvRow(line);
      if (cells.length <= col.amount) continue;

      const money = parseAmountAndCurrency(cells[col.amount] ?? '');
      if (!money) continue;

      let date: string;
      try {
        date = parseDateIso(cells[col.date] ?? '');
      } catch {
        continue;
      }

      const rawDescription = cells[col.description]?.trim() ?? '';
      const description = collapseWhitespace(rawDescription);

      out.push({
        date,
        amountCents: money.cents,
        currency: money.currency,
        description,
        merchant: extractMerchant(rawDescription),
        importHash: hashRow(date, money.cents, description)
      });
    }

    return out;
  }
}

function findHeaderRow(lines: string[]): number {
  for (let i = 0; i < Math.min(lines.length, 200); i++) {
    const l = lines[i].toLowerCase();
    if (!l.includes(';')) continue;
    const hasDate = l.includes('datum operace') || l.includes('datum uskuto') || l.includes('data operacji');
    const hasDesc = l.includes('popis operace') || l.includes('popis operacie') || l.includes('opis operacji');
    if (hasDate && hasDesc) return i;
  }
  return -1;
}

/** Split a single CSV row on `;`, honouring `"..."` quoting. */
function splitCsvRow(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ';' && !inQuotes) {
      cells.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.replace(/^"|"$/g, ''));
}

function normalizeHeader(h: string): string {
  return h
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function findCol(headers: string[], candidates: string[]): number {
  for (const cand of candidates) {
    const idx = headers.findIndex((h) => h.includes(cand));
    if (idx !== -1) return idx;
  }
  return -1;
}

/**
 * Parse an mBank amount cell such as `-951,12 CZK` or `1 500,00 EUR`.
 * Returns null when the cell doesn't look like money (stray empty rows etc).
 */
function parseAmountAndCurrency(cell: string): { cents: number; currency: Currency } | null {
  const trimmed = cell.trim();
  if (!trimmed) return null;

  let amountStr = trimmed;
  let currency = 'EUR';

  // Trailing 3-letter currency code, separated by whitespace.
  const match = trimmed.match(/^(.+?)\s+([A-Z]{3})$/);
  if (match) {
    amountStr = match[1];
    currency = match[2];
  }

  try {
    const cents = parseAmountToCents(amountStr);
    const c = currency.toUpperCase() as Currency;
    return {
      cents,
      currency: (VALID_CURRENCIES as readonly string[]).includes(c) ? c : 'EUR'
    };
  } catch {
    return null;
  }
}

function collapseWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Pull a merchant name from an mBank description.
 *
 * mBank packs multiple fields into one string separated by runs of 2+
 * spaces: `MERCHANT  TRANSACTION_TYPE  EXTRA_INFO`. The first segment is
 * almost always the counterparty (merchant, payer, or a payment reference
 * when there's no named party).
 */
function extractMerchant(rawDesc: string): string | null {
  if (!rawDesc) return null;
  const parts = rawDesc
    .split(/\s{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const first = parts[0];
  if (first && first.length >= 2) return first;
  return null;
}

/** Deterministic hash so repeat imports of the same file are idempotent. */
function hashRow(date: string, amountCents: number, description: string): string {
  const s = `${date}|${amountCents}|${description}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `h${(h >>> 0).toString(16)}`;
}
