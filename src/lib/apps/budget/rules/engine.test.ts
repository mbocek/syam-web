import { expect, test } from 'vitest';
import { classifyByRules, suggestRuleMatch } from './engine';
import type { Rule } from '../types';

const rules: Rule[] = [
  { id: 1, match: 'KAUFLAND', categoryId: 10, hitCount: 0, createdAt: '2026-04-01' },
  { id: 2, match: 'orange', categoryId: 20, hitCount: 0, createdAt: '2026-04-01' }
];

test('matches by merchant case-insensitively', () => {
  expect(classifyByRules({ description: 'x', merchant: 'kaufland sk' }, rules)).toBe(10);
});

test('matches by description substring', () => {
  expect(classifyByRules({ description: 'ORANGE SLOVENSKO a.s.', merchant: null }, rules)).toBe(20);
});

test('no match returns null', () => {
  expect(classifyByRules({ description: 'Random payment', merchant: null }, rules)).toBeNull();
});

test('first matching rule wins', () => {
  const withBoth = classifyByRules({ description: 'KAUFLAND + Orange bundle', merchant: null }, rules);
  expect(withBoth).toBe(10);
});

test('suggestRuleMatch prefers merchant when present', () => {
  expect(suggestRuleMatch({ description: 'abc', merchant: 'ALBERT' })).toBe('ALBERT');
});

test('suggestRuleMatch falls back to longest description token', () => {
  expect(suggestRuleMatch({ description: 'x mo REWE supermarket', merchant: null })).toBe('supermarket');
});
