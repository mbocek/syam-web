import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex, escapeSvelte } from 'mdsvex';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { createHighlighter } from 'shiki';

const theme = 'github-dark';
const highlighter = await createHighlighter({
	themes: [theme],
	langs: ['javascript', 'typescript', 'bash', 'console', 'html', 'css', 'svelte']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extension: '.md',
			rehypePlugins: [rehypeSlug],
			remarkPlugins: [remarkGfm],
			highlight: {
				highlighter: async (code, lang = 'text') => {
					const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme }));
					return `{@html \`${html}\` }`;
				}
			}
		}),
		vitePreprocess()
	],

	kit: {
		// Fallback page lets client-only routes (e.g. /apps/budget/*) work
		// alongside the mostly-prerendered marketing site.
		adapter: adapter({ fallback: 'index.html' }),
		prerender: {
			handleHttpError: 'warn',
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;
