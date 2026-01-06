import { getPosts } from '$lib/posts';

export async function load() {
    const allPosts = await getPosts();

    return {
        posts: allPosts
    };
}
