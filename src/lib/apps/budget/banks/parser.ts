import type { ParsedTransaction } from '../types';

/**
 * Contract every bank parser implements. Keeps bank-specific quirks
 * (encoding, delimiter, column names, sign conventions, merchant extraction)
 * confined to a single module; the rest of the app sees only ParsedTransaction.
 */
export interface BankParser {
  /** Short identifier — e.g. "mbank-sk". */
  readonly id: string;
  /** Human-readable label shown in the import UI. */
  readonly label: string;
  /** Heuristic: can this parser plausibly handle the given file? */
  sniff(content: string, fileName: string): boolean;
  /** Parse file contents into normalized transactions. */
  parse(content: string): ParsedTransaction[];
}

/**
 * Decode an ArrayBuffer as text, auto-detecting between UTF-8 and Windows-1250.
 * Banks in Central Europe often export legacy Windows-1250 CSVs.
 */
export function decodeBytes(bytes: ArrayBuffer): string {
  const utf8 = new TextDecoder('utf-8', { fatal: true });
  try {
    return utf8.decode(bytes);
  } catch {
    return new TextDecoder('windows-1250').decode(bytes);
  }
}
