# Development Guidelines - SYAM Web

This document provides essential information for developers working on the SYAM web project.

## Project Overview
SYAM (Simple Yet Another Monitor) Web is a financial dashboard built with **SvelteKit** and **Tailwind CSS**.

## Build and Configuration

### Prerequisites
- Node.js (latest LTS recommended)
- npm

### Installation
```bash
npm install
```

### Development Server
Run the development server with Hot Module Replacement (HMR):
```bash
npm run dev
# or
make run
```

### Build
Build the project for production:
```bash
npm run build
# or
make build
```
The output depends on the configured SvelteKit adapter (default is `@sveltejs/adapter-auto`).

## Architecture and UI

### Technology Stack
- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/vite`)
- **Icons**: [Lucide Svelte](https://lucide.dev/guide/svelte)
- **Charts**: [Chart.js](https://www.chartjs.org/)

### Key Directories
- `src/lib/components/ui`: Reusable UI components (Cards, Selectors, etc.)
- `src/lib/stores`: Svelte stores for state management (e.g., language, user preferences)
- `src/lib/i18n`: Translation files (`en.js`, `sk.js`, `cs.js`)
- `src/lib/views`: Larger functional components or page sections
- `src/routes`: SvelteKit routing structure

### Internationalization (i18n)
The project uses a custom store-based i18n system. Use the `$t` store to translate strings:
```javascript
import { t } from '$lib/stores/language';
// In markup:
// {$t('common.save')}
```

## Testing

### Configuration
The project uses **Vitest** for unit and component testing.

Key configuration in `vite.config.js`:
- Environment: `jsdom`
- Resolve conditions: `['browser', 'development']` (Required for Svelte 5 testing)

### Running Tests
Execute all tests once:
```bash
npm run test
# or
make test
```

To run tests in watch mode:
```bash
npx vitest
```

### Adding New Tests
Tests should be placed next to the file they are testing or in the same directory with the `.test.js` extension.

Example unit test (`src/lib/stores/language.test.js`):
```javascript
import { expect, test } from 'vitest';
import { get } from 'svelte/store';
import { language } from './language';

test('initial language is en', () => {
  expect(get(language)).toBe('en');
});
```

## Additional Development Information

### Code Style
- **Svelte 5 Runes**: This project uses Svelte 5. Prefer runes like `$state`, `$derived`, and `$effect` over legacy Svelte 4 syntax.
- **Modern JavaScript**: The project is configured for `esnext` target. You can use modern ECMA features.
- **Tailwind CSS**: Use Tailwind classes for styling. Global styles are in `src/app.css`.

### Linting
Currently, a placeholder is defined for linting.
```bash
npm run lint
# or
make lint
```
