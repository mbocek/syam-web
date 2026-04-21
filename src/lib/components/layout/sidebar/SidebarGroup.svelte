<script>
  import { page } from '$app/state';
  import { ChevronDown } from 'lucide-svelte';
  import { isActivePath } from '$lib/utils/navigation.js';

  let {
    href,
    label,
    icon: Icon,
    isCollapsed = false,
    autoOpenPath,
    children
  } = $props();

  let isOpen = $state(false);

  let isActive = $derived(href ? isActivePath(page.url.pathname, href) : false);

  // Auto-expand when the current route matches our href or an explicit
  // autoOpenPath (for toggle-only groups that aren't themselves links).
  // Runs on pathname changes only, so user-initiated collapse is preserved
  // until navigation moves elsewhere and back.
  $effect(() => {
    const path = autoOpenPath ?? href;
    if (path && isActivePath(page.url.pathname, path)) {
      isOpen = true;
    }
  });

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<li class="pt-2 pb-1 relative group/group">
  {#if href}
    <!-- Group with a link: anchor navigates, chevron toggles -->
    <div
      class="flex items-stretch rounded-lg overflow-hidden transition-colors
        {isActive && !isCollapsed ? 'bg-blue-600/10' : 'hover:bg-white/5'}"
    >
      <a
        {href}
        class="flex-1 flex items-center px-3 py-2 text-base font-medium transition-colors
          {isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'}"
        aria-current={isActive ? 'page' : undefined}
      >
        <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
          {#if Icon}
            <Icon size={20} class="transition-colors {isActive ? 'text-blue-400' : 'text-gray-400 group-hover/group:text-white'}" />
          {/if}
        </div>
        {#if !isCollapsed}
          <span class="flex-1 text-left">{label}</span>
        {/if}
      </a>
      {#if !isCollapsed}
        <button
          type="button"
          onclick={toggle}
          class="pl-2 pr-3 text-gray-500 hover:text-white transition-colors cursor-pointer"
          aria-expanded={isOpen}
          aria-label="{isOpen ? 'Collapse' : 'Expand'} {label}"
        >
          <ChevronDown size={14} class="transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
        </button>
      {/if}
    </div>
  {:else}
    <!-- Group without a link: entire row is a toggle button -->
    <button
      type="button"
      onclick={toggle}
      class="w-full flex items-center px-3 py-2 text-base font-medium rounded-lg transition-colors cursor-pointer
        {isOpen && !isCollapsed ? 'text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}"
      aria-expanded={isOpen}
    >
      <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
        {#if Icon}
          <Icon size={20} class="transition-colors {isOpen && !isCollapsed ? 'text-blue-400' : 'text-gray-400 group-hover/group:text-white'}" />
        {/if}
      </div>
      {#if !isCollapsed}
        <span class="flex-1 text-left">{label}</span>
        <ChevronDown size={14} class="text-gray-500 group-hover/group:text-white transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
      {/if}
    </button>
  {/if}

  <ul
    class="mt-1 space-y-1
      {isCollapsed
        ? 'hidden group-hover/group:block absolute left-[52px] top-0 w-48 bg-surface-dark border border-border-dark rounded-card p-2 shadow-card z-50'
        : isOpen
          ? 'ml-4 border-l border-border-dark'
          : 'hidden'}"
  >
    {#if isCollapsed}
      <li class="px-3 py-2 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-border-dark">
        {label}
      </li>
    {/if}
    {@render children()}
  </ul>
</li>
