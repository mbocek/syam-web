/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

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

import { language, t } from './language.js';

describe('i18n store', () => {
  beforeEach(() => {
    language.set('en');
  });

  it('provides English translations by default', () => {
    const translate = get(t);
    expect(translate('dashboard.title')).toBe('Dashboard');
  });

  it('switches translations when language changes', () => {
    language.set('sk');
    let translate = get(t);
    expect(translate('dashboard.title')).toBe('Prehľad');

    language.set('cs');
    translate = get(t);
    expect(translate('dashboard.title')).toBe('Přehled');
  });

  it('falls back to English for missing keys', () => {
    language.set('sk');
    const translate = get(t);
    // Assuming 'nonexistent.key' is not in any file
    expect(translate('nonexistent.key')).toBe('nonexistent.key');
  });

  it('handles nested keys', () => {
    const translate = get(t);
    expect(translate('dashboard.features.title')).toBe('Key Features');
  });
});
