import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const initialLang = browser ? (localStorage.getItem('language') || 'en') : 'en';

export const language = writable(initialLang);

export const currencies = {
  en: '$',
  sk: '€',
  cs: 'Kč'
};

if (browser) {
  language.subscribe(value => {
    localStorage.setItem('language', value);
  });
}
