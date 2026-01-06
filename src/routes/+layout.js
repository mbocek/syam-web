import { getPosts } from '$lib/posts';

export const prerender = true;
export const trailingSlash = 'always';

export async function load() {
    const allPosts = await getPosts();

    const archive = {};

    allPosts.forEach(post => {
        const date = new Date(post.meta.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-indexed

        if (!archive[year]) {
            archive[year] = new Set();
        }
        archive[year].add(month);
    });

    // Convert Sets to sorted arrays
    const sortedArchive = Object.keys(archive)
        .sort((a, b) => b - a)
        .map(year => ({
            year: parseInt(year),
            months: Array.from(archive[year]).sort((a, b) => b - a)
        }));

    return {
        blogArchive: sortedArchive
    };
}
