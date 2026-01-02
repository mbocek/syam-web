import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import en from '../i18n/en.js';
import sk from '../i18n/sk.js';
import cs from '../i18n/cs.js';

const translations = { en, sk, cs };

const initialLang = (browser) 
  ? 'en' 
  : 'en';

// Move localStorage access to a function or $effect if possible, but store needs it early
// Let's try to just avoid it during test if not available
function getStoredLanguage() {
    if (browser) {
        try {
            if (typeof localStorage !== 'undefined') {
                return localStorage.getItem('language') || 'en';
            }
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
  return (key) => {
    const keys = key.split('.');
    let value = translations[$language] || translations['en'];
    
    for (const k of keys) {
      if (value[k] === undefined) {
        // Fallback to English if key missing in current language
        let fallback = translations['en'];
        for (const fk of keys) {
            fallback = fallback?.[fk];
        }
        return fallback || key;
      }
      value = value[k];
    }
    
    return value;
  };
});

if (browser) {
  language.subscribe(value => {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('language', value);
        }
    } catch (e) {
        // Ignore storage errors in restricted environments
    }
  });
}
