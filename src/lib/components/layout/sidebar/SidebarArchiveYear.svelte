<script>
  import { page } from '$app/state';
  import { Calendar, ChevronDown, Dot } from 'lucide-svelte';
  import { i18n } from '$lib/stores/language.svelte.js';
  import { monthKey } from '$lib/utils/months.js';
  import { isActivePath } from '$lib/utils/navigation.js';
  import SidebarItem from './SidebarItem.svelte';

  let { year, months, isCollapsed = false } = $props();

  let href = $derived(`/blog/archive/${year}`);

  let isOpen = $state(false);
  let isActive = $derived(isActivePath(page.url.pathname, href));

  $effect(() => {
    if (isActivePath(page.url.pathname, href)) {
      isOpen = true;
    }
  });

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<li class="flex flex-col">
  <div
    class="flex items-stretch group/year rounded-md overflow-hidden transition-colors
      {isActive && !isCollapsed ? 'bg-blue-600/10' : 'hover:bg-white/5'}
      {!isCollapsed ? 'ml-2' : ''}"
  >
    <a
      {href}
      class="flex-1 flex items-center px-3 py-1.5 text-sm font-medium transition-colors
        {isActive ? 'text-blue-400' : 'text-gray-500 group-hover/year:text-gray-300'}"
      aria-current={isActive ? 'page' : undefined}
    >
      <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-2'}">
        <Calendar size={14} class="opacity-70" />
      </div>
      {#if !isCollapsed}
        {year}
      {/if}
    </a>
    {#if !isCollapsed}
      <button
        type="button"
        onclick={toggle}
        class="pl-2 pr-3 text-gray-600 hover:text-white transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-label="{isOpen ? 'Collapse' : 'Expand'} {year}"
      >
        <ChevronDown size={14} class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
      </button>
    {/if}
  </div>

  {#if isOpen}
    <ul class="mt-1 space-y-1 {isCollapsed ? 'ml-4' : 'ml-4 border-l border-border-dark'}">
      {#each months as month}
        <SidebarItem
          href="/blog/archive/{year}/{month}"
          label={i18n.t(monthKey(month))}
          icon={Dot}
          {isCollapsed}
          indent={true}
        />
      {/each}
    </ul>
  {/if}
</li>
