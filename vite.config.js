import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    tailwindcss()
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    server: {
      deps: {
        inline: [/svelte/]
      }
    }
  },
  resolve: {
    conditions: ['browser', 'development']
  }
});
