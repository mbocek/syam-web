<script>
	import { i18n } from '$lib/stores/language.svelte.js';
	import { Calendar, ArrowRight } from 'lucide-svelte';
	let { data } = $props();
</script>

<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-12">
		<h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
			{i18n.t('common.blog')}
		</h1>
		<p class="mt-4 text-lg text-gray-500">
			{data.year}
		</p>
	</div>

	<div class="grid gap-10">
		{#if data.posts.length > 0}
			{#each data.posts as post}
				<article class="group relative flex flex-col items-start">
					<h2 class="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
						<a href="/blog/{post.slug}">
							<span class="absolute -inset-y-2.5 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
							<span class="relative z-10">{post.meta.title}</span>
						</a>
					</h2>
					<div class="relative z-10 order-first mb-3 flex items-center text-sm text-gray-500">
						<Calendar class="mr-1.5 h-4 w-4 flex-none" />
						<time datetime={post.meta.date}>{i18n.formatDate(post.meta.date)}</time>
					</div>
					<p class="relative z-10 mt-2 text-gray-600 leading-relaxed">
						{post.meta.description}
					</p>
					<div class="relative z-10 mt-4 flex items-center text-sm font-semibold text-blue-600">
						{i18n.t('blog.readMore') || 'Read more'}
						<ArrowRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
					</div>
				</article>
			{/each}
		{:else}
			<p class="text-gray-600">{i18n.t('blog.noPostsFound')}</p>
		{/if}
	</div>
</div>
