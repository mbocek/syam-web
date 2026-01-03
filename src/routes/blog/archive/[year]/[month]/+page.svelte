<script>
	import { t } from '$lib/stores/language.js';
	let { data } = $props();

	const monthNames = {
		1: 'january',
		2: 'february',
		3: 'march',
		4: 'april',
		5: 'may',
		6: 'june',
		7: 'july',
		8: 'august',
		9: 'september',
		10: 'october',
		11: 'november',
		12: 'december'
	};
</script>

<div class="w-full p-6">
	<div class="mb-8">
		<h1 class="text-3xl font-bold">{$t('common.blog')}</h1>
		<p class="text-gray-500 mt-2">
			{data.year} - {$t(`month.${monthNames[data.month]}`)}
		</p>
	</div>

	<div class="grid gap-6">
		{#if data.posts.length > 0}
			{#each data.posts as post}
				<a href="/blog/{post.slug}" class="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
					<h2 class="text-xl font-semibold mb-2">{post.meta.title}</h2>
					<p class="text-gray-500 text-sm mb-4">{post.meta.date}</p>
					<p class="text-gray-700">{post.meta.description}</p>
				</a>
			{/each}
		{:else}
			<p class="text-gray-600">{$t('blog.noPostsFound')}</p>
		{/if}
	</div>
</div>
