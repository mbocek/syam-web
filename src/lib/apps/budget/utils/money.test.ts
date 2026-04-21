import { expect, test } from 'vitest';
import { parseAmountToCents, formatCents } from './money';

test('plain integer', () => {
  expect(parseAmountToCents('42')).toBe(4200);
});

test('decimal with comma', () => {
  expect(parseAmountToCents('42,50')).toBe(4250);
});

test('decimal with dot', () => {
  expect(parseAmountToCents('42.50')).toBe(4250);
});

test('thousand separator with dot, decimal with comma', () => {
  expect(parseAmountToCents('1.234,56')).toBe(123456);
});

test('thousand separator with space, decimal with comma', () => {
  expect(parseAmountToCents('1 234,56')).toBe(123456);
});

test('negative amount', () => {
  expect(parseAmountToCents('-99,99')).toBe(-9999);
});

test('single fractional digit pads to two', () => {
  expect(parseAmountToCents('5,5')).toBe(550);
});

test('rejects garbage', () => {
  expect(() => parseAmountToCents('abc')).toThrow();
  expect(() => parseAmountToCents('')).toThrow();
});

test('format cents', () => {
  expect(formatCents(123456, 'sk-SK').replace(/ /g, ' ')).toBe('1 234,56');
});
