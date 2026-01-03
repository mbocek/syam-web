export async function load() {
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

    return {
        posts: allPosts.sort((a, b) => new Date(b.meta.date) - new Date(a.meta.date))
    };
}
