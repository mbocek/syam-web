# Development Guidelines - SYAM Web

This document provides essential information for developers working on the SYAM web project.

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
The output will be in the `dist/` directory.

## Testing

### Configuration
The project uses **Vitest** for unit and component testing, along with **Svelte Testing Library**.

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
Tests should be placed in the `src/` directory with the `.test.js` (or `.spec.js`) extension.

Example component test (`src/App.test.js`):
```javascript
import { render, screen, fireEvent } from '@testing-library/svelte';
import { expect, test } from 'vitest';
import App from './App.svelte';

test('increments count on button click', async () => {
  render(App);
  const button = screen.getByRole('button');
  
  expect(button.textContent).toContain('Count is 0');
  
  await fireEvent.click(button);
  
  expect(button.textContent).toContain('Count is 1');
});
```

## Additional Development Information

### Code Style
- **Svelte 5 Runes**: This project uses Svelte 5. Prefer runes like `$state`, `$derived`, and `$effect` over legacy Svelte 4 syntax.
- **Modern JavaScript**: The project is configured for `esnext` target. You can use modern ECMA features.
- **CSS**: Plain CSS is used, scoped within Svelte components or in `src/app.css`.

### Linting
Currently, a placeholder is defined for linting. It is recommended to set up ESLint with `eslint-plugin-svelte` for Svelte 5 support.
```bash
npm run lint
# or
make lint
```
