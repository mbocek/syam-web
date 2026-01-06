<script>
	import { i18n } from '$lib/stores/language.svelte.js';
	import { Calendar, ArrowRight, Search } from 'lucide-svelte';
	let { data } = $props();

	let searchQuery = $state('');

	let filteredPosts = $derived(
		data.posts.filter((post) => {
			const searchStr = searchQuery.toLowerCase();
			return (
				post.meta.title.toLowerCase().includes(searchStr) ||
				post.meta.description.toLowerCase().includes(searchStr) ||
				(post.meta.tags && post.meta.tags.some((t) => t.toLowerCase().includes(searchStr)))
			);
		})
	);
</script>

<svelte:head>
	<title>{i18n.t('common.blog')} | SYAM</title>
	<meta name="description" content={i18n.t('blog.blogDescription')} />
</svelte:head>

<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
	<div class="mb-8">
		<h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
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

	<div class="grid gap-10">
		{#each filteredPosts as post}
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
					{i18n.t('blog.readMore')}
					<ArrowRight class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
				</div>
			</article>
		{/each}
	</div>
</div>
