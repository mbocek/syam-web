<script>
  import { page } from '$app/state';
  import { i18n } from '../../../stores/language.svelte.js';

  let { 
    href, 
    label, 
    icon: Icon, 
    isCollapsed = false,
    indent = false,
    active = false
  } = $props();

  const isActive = $derived(active || page.url.pathname === href);
</script>

<li class="relative group/item">
  <a 
    {href}
    class="group/link flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 
      {isActive ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
      {indent ? 'ml-2' : ''}"
  >
    <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
      {#if Icon}
        <Icon size={indent ? 14 : 20} class="transition-colors {isActive ? 'text-blue-400' : 'text-gray-400 group-hover/link:text-white'} {indent ? 'opacity-70' : ''}" />
      {/if}
    </div>
    
    {#if !isCollapsed}
      <span class={indent ? 'text-sm' : ''}>{label}</span>
    {:else if !indent}
      <div class="hidden group-hover/item:block absolute left-[52px] top-0 ml-0 bg-gray-900 border border-gray-800 rounded-lg py-2 px-3 shadow-xl z-50 whitespace-nowrap">
        <span class="text-sm font-medium text-white">{label}</span>
      </div>
    {/if}
  </a>
</li>
