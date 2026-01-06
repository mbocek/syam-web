<script>
  import { page } from '$app/state';
  import { Calendar, ChevronDown, Dot } from 'lucide-svelte';
  import { i18n } from '../../../stores/language.svelte.js';
  import SidebarItem from './SidebarItem.svelte';

  let { 
    year, 
    months, 
    isCollapsed = false, 
    isOpen = false, 
    onToggle 
  } = $props();

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

<li class="flex flex-col">
  <div class="flex items-center group/year">
    <a 
      href="/blog/archive/{year}"
      class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center {page.url.pathname.startsWith(`/blog/archive/${year}`) ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'} {!isCollapsed ? 'ml-2' : ''}"
      onclick={onToggle}
    >
      <Calendar size={14} class="mr-2 opacity-70" />
      {year}
      {#if !isCollapsed}
        <div class="ml-auto transition-transform duration-300 {isOpen ? 'rotate-180' : ''}">
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
