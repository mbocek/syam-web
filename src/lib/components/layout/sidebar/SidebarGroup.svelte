<script>
  import { ChevronDown } from 'lucide-svelte';

  let { 
    label, 
    icon: Icon, 
    isCollapsed = false, 
    isOpen = $bindable(false),
    children 
  } = $props();

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<li class="pt-4 pb-1 relative group">
  {#if !isCollapsed}
    <div class="px-3 mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
      {label}
    </div>
  {/if}
  
  <button 
    onclick={toggle}
    class="w-full flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 
      {isOpen && !isCollapsed ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
  >
    <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
      {#if Icon}
        <Icon size={20} class="transition-colors {isOpen && !isCollapsed ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}" />
      {/if}
    </div>
    {#if !isCollapsed}
      <span class="flex-1 text-left">{label}</span>
      <div class="transition-transform duration-300 {isOpen ? 'rotate-180' : ''}">
        <ChevronDown size={16} class="text-gray-500" />
      </div>
    {/if}
  </button>
  
  <ul class="mt-1 space-y-1 {isCollapsed ? 'hidden group-hover:block absolute left-[52px] top-0 ml-0 w-48 bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-xl z-50' : (isOpen ? 'ml-4 border-l border-gray-800' : 'hidden')}">
    {#if isCollapsed}
      <li class="px-3 py-2 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800">
        {label}
      </li>
    {/if}
    {@render children()}
  </ul>
</li>
