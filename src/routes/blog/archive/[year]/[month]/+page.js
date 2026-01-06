import { getPosts } from '$lib/posts';

export async function load({ params }) {
    const { year, month } = params;
    const allPosts = await getPosts();

    const filteredPosts = allPosts.filter(post => {
        const date = new Date(post.meta.date);
        return date.getFullYear() === parseInt(year) && (date.getMonth() + 1) === parseInt(month);
    });

    return {
        posts: filteredPosts,
        year,
        month
    };
}
