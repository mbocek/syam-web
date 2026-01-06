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
    </a>
    <button 
      onclick={onToggle}
      class="p-1.5 text-gray-600 hover:text-white transition-all rounded-md hover:bg-gray-800"
    >
      <div class="transition-transform duration-300 {isOpen ? 'rotate-180' : ''}">
        <ChevronDown size={14} />
      </div>
    </button>
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
