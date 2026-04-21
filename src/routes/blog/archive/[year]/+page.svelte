<script>
  import { i18n } from '$lib/stores/language.svelte.js';
  import { Calendar } from 'lucide-svelte';
  import BlogPostList from '$lib/components/blog/BlogPostList.svelte';

  let { data } = $props();
</script>

<svelte:head>
  <title>{i18n.t('common.blog')} - {data.year} | SYAM</title>
  <meta name="description" content="{i18n.t('blog.archiveForYear')} {data.year}." />
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl flex items-center">
      <Calendar class="mr-4 h-10 w-10 text-blue-600" />
      {i18n.t('common.blog')}
    </h1>
    <p class="mt-4 text-lg text-gray-500">
      {data.year}
    </p>
  </div>

  <BlogPostList posts={data.posts} />
</div>
