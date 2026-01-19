<script>
  import { page } from '$app/state';
  import { Tag, ChevronDown } from 'lucide-svelte';
  import { i18n } from '../../../stores/language.svelte.js';

  let { 
    tags = [], 
    isCollapsed = false, 
    isBlogOpen = false,
    isOpen = $bindable(false)
  } = $props();

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<li class="flex flex-col mt-2">
  <div class="flex items-center group/tags">
    <button 
      onclick={toggle}
      class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center {isOpen ? 'text-blue-400' : 'text-gray-500 hover:bg-white/10 hover:text-gray-300'} {!isCollapsed ? 'ml-2' : ''}"
    >
      <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-2'}">
        <Tag size={14} class="opacity-70" />
      </div>
      {#if !isCollapsed}
        {i18n.t('blog.tags')}
        <div class="ml-auto p-1 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}">
          <ChevronDown size={14} class="text-gray-600 group-hover/tags:text-white" />
        </div>
      {/if}
    </button>
  </div>
  
  {#if isOpen || (isCollapsed && isBlogOpen)}
    <div class="mt-1 flex flex-wrap gap-2 {isCollapsed ? 'px-2' : 'ml-6 py-2'}">
      {#each tags as tag}
        <a 
          href="/blog/tag/{tag}" 
          class="px-2 py-1 text-[10px] font-medium rounded-md transition-all duration-200 {page.url.pathname === `/blog/tag/${tag}/` ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'}"
        >
          #{tag}
        </a>
      {/each}
    </div>
  {/if}
</li>
