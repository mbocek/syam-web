export async function getPosts() {
  const modules = import.meta.glob('/src/lib/posts/*.md');

  const posts = await Promise.all(
    Object.entries(modules).map(async ([path, resolver]) => {
      const { metadata } = await resolver();
      const slug = path.split('/').pop().slice(0, -3);
      return { meta: metadata, slug };
    })
  );

  return posts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
}

export function getAllTags(posts) {
  const tags = new Set();
  for (const post of posts) {
    post.meta.tags?.forEach((tag) => tags.add(tag));
  }
  return [...tags].sort();
}
