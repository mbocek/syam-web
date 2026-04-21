import { expect, test } from 'vitest';
import { parseDateIso, monthStart, monthKey } from './date';

test('parseDateIso accepts ISO as-is', () => {
  expect(parseDateIso('2025-06-15')).toBe('2025-06-15');
});

test('parseDateIso DD.MM.YYYY', () => {
  expect(parseDateIso('15.06.2025')).toBe('2025-06-15');
});

test('parseDateIso DD.MM.YY expands to 20YY', () => {
  expect(parseDateIso('15.06.25')).toBe('2025-06-15');
});

test('parseDateIso DD/MM/YYYY', () => {
  expect(parseDateIso('15/06/2025')).toBe('2025-06-15');
});

test('monthStart', () => {
  expect(monthStart('2025-06-15')).toBe('2025-06-01');
});

test('monthKey', () => {
  expect(monthKey('2025-06-15')).toBe('2025-06');
});
