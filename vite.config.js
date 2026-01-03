import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { mdsvex } from 'mdsvex';

export default defineConfig({
  plugins: [
    mdsvex({
      extension: '.md',
    }),
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
