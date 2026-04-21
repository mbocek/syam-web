<script>
  import { i18n } from '$lib/stores/language.svelte.js';
  import { Tag } from 'lucide-svelte';
  import BlogPostList from '$lib/components/blog/BlogPostList.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{i18n.t('common.blog')} - #{data.tag} | SYAM</title>
  <meta name="description" content="{i18n.t('blog.postsTaggedWith')} #{data.tag}." />
</svelte:head>

<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl flex items-center">
      <Tag class="mr-4 h-10 w-10 text-blue-600" />
      {i18n.t('common.blog')}
    </h1>
    <p class="mt-4 text-lg text-gray-500">
      {i18n.t('blog.postsTaggedWith')} <span class="text-blue-600 font-semibold">#{data.tag}</span>
    </p>
  </div>

  <BlogPostList posts={data.posts} />
</div>
