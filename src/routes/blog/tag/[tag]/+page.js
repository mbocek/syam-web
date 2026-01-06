import { getPosts } from '$lib/posts';

export async function load({ params }) {
    const { tag } = params;
    const allPosts = await getPosts();
    
    // Filter posts that include the selected tag
    const filteredPosts = allPosts.filter(post => 
        post.meta.tags && post.meta.tags.includes(tag)
    );

    return {
        tag,
        posts: filteredPosts
    };
}
