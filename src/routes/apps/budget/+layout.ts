// Budget is a client-only SPA section: it needs File System Access + sql.js
// which only run in the browser. Disable SSR and prerendering for everything
// under /apps/budget/*.
export const ssr = false;
export const prerender = false;
