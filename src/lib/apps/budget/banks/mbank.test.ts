import { expect, test } from 'vitest';
import { MBankParser } from './mbank';

// Sanitised fixture matching the real mBank CZ export structure:
//   - Long metadata header (bank address, account list, period, totals)
//   - Tab of transactions with columns: Datum operace, Popis operace,
//     Účet, Kategorie, Částka (`-951,12 CZK` format)
//   - Descriptions padded with 2+ spaces between merchant / type / extras
const FIXTURE = `mBank S.A., organizační složka
Pernerova 691/42, 186 00 Praha 8
www.mBank.cz;
mLinka: 844 777 000;
#Klient;
JOHN DOE;
;

Seznam operací;

#Za období:;
21.04.2026;21.04.2026;

#Měna;#Příjmy;#Výdaje;
CZK;62599,00;-64014,12;

#Datum operace;#Popis operace;#Účet;#Kategorie;#Částka;
2026-04-21;"PAYPAL *SCREENWAVE SCREEN  PLATBA NA INTERNETU                                                                 Nezaúčtovaná operace";"John Doe 6701 ... 6210";"Potraviny a drogerie";-951,12 CZK;;
2026-04-21;"Napojovy automat  PLATBA KARTOU                                                                       Nezaúčtovaná operace";"John Doe 6701 ... 6210";"Restaurace";-20,00 CZK;;
2026-04-21;"CSOB 1236 CELAKOVICE  VÝBĚR Z JINÉHO BANKOMATU V ČR                                                       Nezaúčtovaná operace";"John Doe 6701 ... 6210";"Výběr hotovosti";-12000,00 CZK;;
2026-04-21;"JOHN DOE, TRANSFER  U RYBNÍKA 13                       289 16 PŘEROV NAD LABEM, ČESKÁ REPU PŘÍCHOZÍ PLATBA Z MBANK                                                           670100 2229447109 6210  ";"John Doe 6701 ... 6210";"Vklady a spoření";12000,00 CZK;;
2026-04-21;"PAYPAL *ABOUT YOU  VRÁCENÍ PLATBY V ZAHRANIČÍ                                                          Nezaúčtovaná operace";"John Doe 6701 ... 6210";"Příjmy - jiné";599,00 CZK;;
2026-04-21;"Alza.cz  PLATBA NA INTERNETU                                                                 Nezaúčtovaná operace";"John Doe 6701 ... 6210";"Oblečení a obuv";-848,00 CZK;;

mBank S.A., pobočka zahraniční banky...
`;

const parser = new MBankParser();

test('mbank sniff accepts real CZ export', () => {
  expect(parser.sniff(FIXTURE, 'seznam_operaci.csv')).toBe(true);
});

test('mbank parses all six transactions', () => {
  const txns = parser.parse(FIXTURE);
  expect(txns).toHaveLength(6);
});

test('mbank CZK expense: amount negative, currency CZK, date ISO', () => {
  const [first] = parser.parse(FIXTURE);
  expect(first.date).toBe('2026-04-21');
  expect(first.amountCents).toBe(-95112);
  expect(first.currency).toBe('CZK');
});

test('mbank extracts merchant from padded description', () => {
  const txns = parser.parse(FIXTURE);
  expect(txns[0].merchant).toBe('PAYPAL *SCREENWAVE SCREEN');
  expect(txns[1].merchant).toBe('Napojovy automat');
  expect(txns[2].merchant).toBe('CSOB 1236 CELAKOVICE');
  expect(txns[5].merchant).toBe('Alza.cz');
});

test('mbank income row is positive', () => {
  const txns = parser.parse(FIXTURE);
  const transfer = txns.find((t) => t.merchant === 'JOHN DOE, TRANSFER');
  expect(transfer?.amountCents).toBe(1200000);
});

test('mbank description collapses runs of whitespace', () => {
  const [first] = parser.parse(FIXTURE);
  expect(first.description).toBe('PAYPAL *SCREENWAVE SCREEN PLATBA NA INTERNETU Nezaúčtovaná operace');
});

test('mbank refund keeps positive amount', () => {
  const txns = parser.parse(FIXTURE);
  const refund = txns.find((t) => t.merchant === 'PAYPAL *ABOUT YOU');
  expect(refund?.amountCents).toBe(59900);
});

test('mbank import hash is deterministic for the same input', () => {
  const a = parser.parse(FIXTURE);
  const b = parser.parse(FIXTURE);
  expect(a.map((t) => t.importHash)).toEqual(b.map((t) => t.importHash));
});

test('mbank amount change produces a different hash', () => {
  const [first] = parser.parse(FIXTURE);
  const mutated = FIXTURE.replace('-951,12 CZK', '-951,13 CZK');
  const [mutatedFirst] = parser.parse(mutated);
  expect(first.importHash).not.toBe(mutatedFirst.importHash);
});
