export async function getPosts() {
    const posts = import.meta.glob('/src/lib/posts/*.md');
    const iterablePosts = Object.entries(posts);

    const allPosts = await Promise.all(
        iterablePosts.map(async ([path, resolver]) => {
            const { metadata } = await resolver();
            const slug = path.split('/').pop().slice(0, -3);
            return {
                meta: metadata,
                slug
            };
        })
    );

    return allPosts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date));
}

export async function getAllTags() {
    const posts = await getPosts();
    const tags = new Set();
    posts.forEach(post => {
        if (post.meta.tags) {
            post.meta.tags.forEach(tag => tags.add(tag));
        }
    });
    return Array.from(tags).sort();
}
