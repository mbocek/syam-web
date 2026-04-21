import type { BankParser } from './parser';
import { MBankParser } from './mbank';

const PARSERS: BankParser[] = [new MBankParser()];

/** Pick the best matching parser for the given file, or `null`. */
export function detectParser(content: string, fileName: string): BankParser | null {
  for (const p of PARSERS) if (p.sniff(content, fileName)) return p;
  return null;
}

export const availableParsers: readonly BankParser[] = PARSERS;
