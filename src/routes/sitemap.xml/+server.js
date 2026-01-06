import { getPosts } from '$lib/posts';

export const prerender = true;

export async function GET() {
    const posts = await getPosts();
    const siteUrl = 'https://syam.zone';
    
    // Base pages
    const pages = [
        '',
        'blog',
        'calculators/compound-interest',
        'calculators/mortgage'
    ];

    // Archive pages (following the same logic as in +layout.js)
    const archiveYears = new Set();
    const archiveMonths = new Set();

    posts.forEach(post => {
        const date = new Date(post.meta.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        archiveYears.add(year);
        archiveMonths.add(`${year}/${month}`);
    });

    archiveYears.forEach(year => pages.push(`blog/archive/${year}`));
    archiveMonths.forEach(month => pages.push(`blog/archive/${month}`));

    // Blog post pages
    posts.forEach(post => pages.push(`blog/${post.slug}`));

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
    .map(page => {
        return `  <url>
    <loc>${siteUrl}/${page}${page ? '/' : ''}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}
