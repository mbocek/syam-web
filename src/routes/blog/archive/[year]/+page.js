import { getPosts } from '$lib/posts';

export async function load({ params }) {
    const { year } = params;
    const allPosts = await getPosts();

    const filteredPosts = allPosts.filter(post => {
        const date = new Date(post.meta.date);
        return date.getFullYear() === parseInt(year);
    });

    return {
        posts: filteredPosts,
        year
    };
}
