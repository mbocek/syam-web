import { getPosts, getAllTags } from '$lib/posts';

export const prerender = true;
export const trailingSlash = 'always';

export async function load() {
  const posts = await getPosts();

  const archive = new Map();
  for (const post of posts) {
    const date = new Date(post.meta.date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    if (!archive.has(year)) archive.set(year, new Set());
    archive.get(year).add(month);
  }

  const blogArchive = [...archive.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      months: [...months].sort((a, b) => b - a)
    }));

  return {
    blogArchive,
    blogTags: getAllTags(posts)
  };
}
