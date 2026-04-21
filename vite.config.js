import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __COMMIT_HASH__: JSON.stringify(commitHash)
  },
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
