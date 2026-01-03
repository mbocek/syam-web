<script>
	import { t } from '$lib/stores/language.js';
	let { data } = $props();
</script>

<div class="w-full p-6">
	<h1 class="text-3xl font-bold mb-8">{$t('common.blog')}</h1>

	<div class="grid gap-6">
		{#each data.posts as post}
			<a href="/blog/{post.slug}" class="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
				<h2 class="text-xl font-semibold mb-2">{post.meta.title}</h2>
				<p class="text-gray-500 text-sm mb-4">{post.meta.date}</p>
				<p class="text-gray-700">{post.meta.description}</p>
			</a>
		{/each}
	</div>
</div>
