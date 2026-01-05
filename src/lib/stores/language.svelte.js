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

class LanguageStore {
  current = $state(getStoredLanguage());
  
  currencies = {
    en: '$',
    sk: '€',
    cs: 'Kč'
  };

  constructor() {
    $effect.root(() => {
      $effect(() => {
        if (browser) {
          try {
            localStorage.setItem('language', this.current);
          } catch (e) {
            // Ignore
          }
        }
      });
    });
  }

  set(value) {
    this.current = value;
  }

  t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[this.current] || translations['en'];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
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

  formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(this.current, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  formatNumber = (number, decimals = 2) => {
    if (number === undefined || number === null) return '';
    const val = typeof number === 'string' ? parseFloat(number) : number;
    return new Intl.NumberFormat(this.current === 'en' ? 'fr-FR' : this.current, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(val).replace(/\u00a0/g, ' ').replace(/\u202f/g, ' ');
  };

  get currency() {
    return this.currencies[this.current] || '€';
  }
}

export const i18n = new LanguageStore();
