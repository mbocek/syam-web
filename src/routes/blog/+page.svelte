<script>
  import { i18n } from '$lib/stores/language.svelte.js';
  import { Search, BookOpen } from 'lucide-svelte';
  import BlogPostList from '$lib/components/blog/BlogPostList.svelte';

  let { data } = $props();

  let searchQuery = $state('');

  let filteredPosts = $derived(
    data.posts.filter((post) => {
      const q = searchQuery.toLowerCase();
      return (
        post.meta.title.toLowerCase().includes(q) ||
        post.meta.description.toLowerCase().includes(q) ||
        post.meta.tags?.some((t) => t.toLowerCase().includes(q))
      );
    })
  );
</script>

<svelte:head>
  <title>{i18n.t('common.blog')} | SYAM</title>
  <meta name="description" content={i18n.t('blog.blogDescription')} />
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-8">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl flex items-center">
      <BookOpen class="mr-4 h-10 w-10 text-blue-600" />
      {i18n.t('common.blog')}
    </h1>
    <p class="mt-4 text-lg text-gray-500">
      {i18n.t('blog.blogSubtitle')}
    </p>
  </div>

  <div class="mb-12 relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search class="h-5 w-5 text-gray-400" />
    </div>
    <input
      type="text"
      bind:value={searchQuery}
      placeholder={i18n.t('blog.searchPlaceholder')}
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all shadow-sm"
    />
  </div>

  <BlogPostList posts={filteredPosts} />
</div>
