import { expect, test } from 'vitest';
import { isActivePath } from './navigation.js';

test('root matches only root', () => {
  expect(isActivePath('/', '/')).toBe(true);
  expect(isActivePath('/blog', '/')).toBe(false);
  expect(isActivePath('/blog/', '/')).toBe(false);
});

test('exact match', () => {
  expect(isActivePath('/blog', '/blog')).toBe(true);
  expect(isActivePath('/blog/', '/blog')).toBe(true);
});

test('child path matches parent href', () => {
  expect(isActivePath('/blog/archive/2020', '/blog')).toBe(true);
  expect(isActivePath('/blog/archive/2020/', '/blog')).toBe(true);
});

test('sibling prefix does not match', () => {
  // /blog/archive/202 must not match /blog/archive/2020
  expect(isActivePath('/blog/archive/202', '/blog/archive/2020')).toBe(false);
  // /calculators must not match /calc
  expect(isActivePath('/calculators', '/calc')).toBe(false);
});

test('trailing slash on href', () => {
  expect(isActivePath('/blog', '/blog/')).toBe(true);
  expect(isActivePath('/blog/archive', '/blog/')).toBe(true);
});

test('null / empty href returns false', () => {
  expect(isActivePath('/blog', '')).toBe(false);
  expect(isActivePath('/blog', null)).toBe(false);
});
