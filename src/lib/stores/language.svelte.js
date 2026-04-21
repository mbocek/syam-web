import { browser } from '$app/environment';
import en from '../i18n/en.js';
import sk from '../i18n/sk.js';
import cs from '../i18n/cs.js';

const translations = { en, sk, cs };
const currencies = { en: '$', sk: '€', cs: 'Kč' };
const STORAGE_KEY = 'language';

// Match NBSP (U+00A0) and narrow NBSP (U+202F) produced by Intl.NumberFormat.
const NBSP_RE = /[  ]/g;

function getStoredLanguage() {
  if (!browser || typeof localStorage?.getItem !== 'function') return 'en';
  return localStorage.getItem(STORAGE_KEY) || 'en';
}

function resolve(dict, keys) {
  return keys.reduce((acc, k) => acc?.[k], dict);
}

class LanguageStore {
  current = $state(getStoredLanguage());

  constructor() {
    $effect.root(() => {
      $effect(() => {
        if (browser && typeof localStorage?.setItem === 'function') {
          localStorage.setItem(STORAGE_KEY, this.current);
        }
      });
    });
  }

  set(value) {
    this.current = value;
  }

  t = (key, params = {}) => {
    const keys = key.split('.');
    const value = resolve(translations[this.current], keys) ?? resolve(translations.en, keys) ?? key;

    if (typeof value !== 'string') return value;
    return Object.entries(params).reduce((s, [p, v]) => s.replace(`{${p}}`, v), value);
  };

  formatDate = (dateString) => {
    if (!dateString) return '';
    return new Intl.DateTimeFormat(this.current, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  formatNumber = (number, decimals = 2) => {
    if (number === undefined || number === null) return '';
    const val = typeof number === 'string' ? parseFloat(number) : number;
    // Force space thousand separators for 'en' by using 'fr-FR'.
    const locale = this.current === 'en' ? 'fr-FR' : this.current;
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
      .format(val)
      .replace(NBSP_RE, ' ');
  };

  get currency() {
    return currencies[this.current] || '€';
  }
}

export const i18n = new LanguageStore();
