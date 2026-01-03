import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import en from '../i18n/en.js';
import sk from '../i18n/sk.js';
import cs from '../i18n/cs.js';

const translations = { en, sk, cs };

function getStoredLanguage() {
  if (browser) {
    try {
      return localStorage.getItem('language') || 'en';
    } catch (e) {
      // Ignore
    }
  }
  return 'en';
}

export const language = writable(getStoredLanguage());

export const currencies = {
  en: '$',
  sk: '€',
  cs: 'Kč'
};

export const t = derived(language, ($language) => {
  return (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[$language] || translations['en'];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English if key missing in current language
        let fallback = translations['en'];
        for (const fk of keys) {
          fallback = fallback?.[fk];
        }
        value = fallback || key;
        break;
      }
    }
    
    if (typeof value === 'string') {
      Object.entries(params).forEach(([param, val]) => {
        value = value.replace(`{${param}}`, val);
      });
    }
    
    return value;
  };
});

if (browser) {
  language.subscribe(value => {
    try {
      localStorage.setItem('language', value);
    } catch (e) {
      // Ignore
    }
  });
}
