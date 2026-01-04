<script>
    import { t, formatDate } from '$lib/stores/language.js';
    import { Calendar, ChevronLeft, List } from 'lucide-svelte';
	let { data } = $props();

    let headings = $state([]);

    $effect(() => {
        const articleElement = document.querySelector('.prose');
        if (articleElement) {
            const headingElements = articleElement.querySelectorAll('h2, h3');
            headings = Array.from(headingElements).map(h => ({
                text: h.innerText,
                id: h.id,
                level: h.tagName.toLowerCase()
            }));
        }
    });
</script>

<article class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mb-8">
        <a href="/blog" class="group inline-flex items-center font-semibold text-blue-600 hover:text-blue-800 transition-colors">
            <ChevronLeft class="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {$t('blog.backToBlog')}
        </a>
    </div>

	<header class="mb-12">
		<h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            {data.meta.title}
        </h1>
        <div class="flex items-center text-sm text-gray-500">
            <Calendar class="mr-1.5 h-4 w-4 flex-none" />
            <span>{$t('blog.publishedAt')}: {$formatDate(data.meta.date)}</span>
        </div>
	</header>

    {#if headings.length > 0}
        <nav class="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center mb-4 text-gray-900 font-bold">
                <List class="mr-2 h-5 w-5" />
                <span>{$t('blog.toc')}</span>
            </div>
            <ul class="space-y-2">
                {#each headings as heading}
                    <li class={heading.level === 'h3' ? 'ml-4' : ''}>
                        <a href="#{heading.id}" class="text-blue-600 hover:underline">
                            {heading.text}
                        </a>
                    </li>
                {/each}
            </ul>
        </nav>
    {/if}
	
	<div class="prose prose-blue lg:prose-xl max-w-none prose-headings:font-bold prose-a:text-blue-600">
		<data.content />
	</div>

    <div class="mt-16 pt-8 border-t border-gray-200">
        <a href="/blog" class="group inline-flex items-center text-blue-600 font-semibold hover:text-blue-800 transition-colors">
            <ChevronLeft class="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {$t('blog.backToBlog')}
        </a>
    </div>
</article>
