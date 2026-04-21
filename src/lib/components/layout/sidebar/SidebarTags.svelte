<script>
  import { page } from '$app/state';
  import { Tag, ChevronDown } from 'lucide-svelte';
  import { i18n } from '../../../stores/language.svelte.js';

  let { tags = [], isCollapsed = false } = $props();

  let isOpen = $state(false);

  // Auto-open when viewing any /blog/tag/* page.
  $effect(() => {
    if (page.url.pathname.startsWith('/blog/tag/')) {
      isOpen = true;
    }
  });

  function currentTag(pathname) {
    const m = pathname.match(/^\/blog\/tag\/([^/]+)\/?$/);
    return m ? m[1] : null;
  }

  let active = $derived(currentTag(page.url.pathname));
</script>

<li class="flex flex-col mt-2">
  {#if !isCollapsed}
    <button
      type="button"
      onclick={() => (isOpen = !isOpen)}
      class="ml-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center cursor-pointer
        {isOpen || active ? 'text-blue-400' : 'text-gray-500 hover:bg-white/10 hover:text-gray-300'}"
      aria-expanded={isOpen}
    >
      <Tag size={14} class="opacity-70 mr-2" />
      <span class="flex-1 text-left">{i18n.t('blog.tags')}</span>
      <ChevronDown size={14} class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
    </button>
  {/if}

  {#if isOpen || isCollapsed}
    <div class="mt-1 flex flex-wrap gap-2 {isCollapsed ? 'px-2' : 'ml-6 py-2'}">
      {#each tags as tag}
        <a
          href="/blog/tag/{tag}"
          class="px-2 py-1 text-[10px] font-medium rounded-md transition-colors
            {active === tag ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'}"
          aria-current={active === tag ? 'page' : undefined}
        >
          #{tag}
        </a>
      {/each}
    </div>
  {/if}
</li>
