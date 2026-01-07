<script>
  import { page } from '$app/state';
  import { Calendar, ChevronDown, Dot } from 'lucide-svelte';
  import { i18n } from '$lib/stores/language.svelte.js';
  import SidebarItem from './SidebarItem.svelte';

  let { 
    year, 
    months, 
    isCollapsed = false, 
    isOpen = false, 
    onToggle 
  } = $props();

  const monthNames = [
    '', 'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
</script>

<li class="flex flex-col">
  <div class="flex items-center group/year">
    <a 
      href="/blog/archive/{year}"
      class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center 
        {page.url.pathname.startsWith(`/blog/archive/${year}`) ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'} 
        {!isCollapsed ? 'ml-2' : ''}"
      onclick={() => !isOpen && onToggle()}
    >
      <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-2'}">
        <Calendar size={14} class="opacity-70" />
      </div>
      {#if !isCollapsed}
        {year}
        <div 
          class="ml-auto p-1 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
          onclick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          role="button"
          tabindex="0"
          onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onToggle();
            }
          }}
        >
          <ChevronDown size={14} class="text-gray-600 group-hover/year:text-white" />
        </div>
      {/if}
    </a>
  </div>
  
  {#if isOpen}
    <ul class="mt-1 space-y-1 {isCollapsed ? 'ml-4' : 'ml-4 border-l border-gray-800'}">
      {#each months as month}
        <SidebarItem 
          href="/blog/archive/{year}/{month}" 
          label={i18n.t(`month.${monthNames[month]}`)} 
          icon={Dot} 
          {isCollapsed} 
          indent={true}
        />
      {/each}
    </ul>
  {/if}
</li>
