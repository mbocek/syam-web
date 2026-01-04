/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock browser environment for SvelteKit
vi.mock('$app/environment', () => ({
  browser: true
}));

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn(key => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();
global.localStorage = localStorageMock;

import { i18n } from './language.svelte.js';

describe('i18n store', () => {
  beforeEach(() => {
    i18n.set('en');
  });

  it('formats dates in English', () => {
    const format = i18n.formatDate;
    const date = '2020-05-01';
    // Depending on the environment, long month might have different spacing or characters, 
    // but typically it's "May 1, 2020" or similar for 'en'
    expect(format(date)).toContain('May 1');
    expect(format(date)).toContain('2020');
  });

  it('formats dates in Slovak', () => {
    i18n.set('sk');
    const format = i18n.formatDate;
    const date = '2020-05-01';
    // For 'sk', it should be "1. mája 2020" or similar
    expect(format(date)).toContain('1.');
    expect(format(date)).toContain('mája');
    expect(format(date)).toContain('2020');
  });

  it('formats dates in Czech', () => {
    i18n.set('cs');
    const format = i18n.formatDate;
    const date = '2020-05-01';
    // For 'cs', it should be "1. května 2020" or similar
    expect(format(date)).toContain('1.');
    expect(format(date)).toContain('května');
    expect(format(date)).toContain('2020');
  });

  it('provides English translations by default', () => {
    const translate = i18n.t;
    expect(translate('common.dashboard')).toBe('Dashboard');
  });

  it('switches translations when language changes', () => {
    i18n.set('sk');
    let translate = i18n.t;
    expect(translate('common.dashboard')).toBe('Prehľad');

    i18n.set('cs');
    translate = i18n.t;
    expect(translate('common.dashboard')).toBe('Přehled');
  });

  it('falls back to English for missing keys', () => {
    i18n.set('sk');
    const translate = i18n.t;
    // Assuming 'nonexistent.key' is not in any file
    expect(translate('nonexistent.key')).toBe('nonexistent.key');
  });

  it('handles nested keys', () => {
    const translate = i18n.t;
    expect(translate('dashboard.features.modern')).toBe('Modern UI: Built with Svelte 5 for a fast and responsive experience.');
  });

  it('supports interpolation', () => {
    const translate = i18n.t;
    expect(translate('calculator.basis', { rate: 5, years: 10 }))
      .toBe('Based on a 5% annual interest rate over 10 years.');
  });
});
