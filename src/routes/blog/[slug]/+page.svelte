<script>
    import { t } from '$lib/stores/language.js';
	let { data } = $props();
</script>

<article class="w-full p-6">
    <div class="mb-8">
        <a href="/blog" class="text-blue-600 hover:underline">← {$t('blog.backToBlog')}</a>
    </div>

	<header class="mb-8">
		<h1 class="text-4xl font-bold mb-2">{data.meta.title}</h1>
		<p class="text-gray-500">{$t('blog.publishedAt')}: {data.meta.date}</p>
	</header>
	
	<div class="prose lg:prose-xl max-w-none">
		<data.content />
	</div>
</article>
