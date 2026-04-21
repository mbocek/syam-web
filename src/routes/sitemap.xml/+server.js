import { getPosts } from '$lib/posts';

export const prerender = true;

const SITE_URL = 'https://syam.zone';

const STATIC_PAGES = [
  '',
  'blog',
  'calculators/compound-interest',
  'calculators/mortgage'
];

export async function GET() {
  const posts = await getPosts();

  const years = new Set();
  const months = new Set();
  for (const post of posts) {
    const date = new Date(post.meta.date);
    years.add(date.getFullYear());
    months.add(`${date.getFullYear()}/${date.getMonth() + 1}`);
  }

  const pages = [
    ...STATIC_PAGES,
    ...[...years].map((y) => `blog/archive/${y}`),
    ...[...months].map((m) => `blog/archive/${m}`),
    ...posts.map((p) => `blog/${p.slug}`)
  ];

  const urls = pages
    .map((page) => `  <url>
    <loc>${SITE_URL}/${page}${page ? '/' : ''}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`)
    .join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' }
  });
}
