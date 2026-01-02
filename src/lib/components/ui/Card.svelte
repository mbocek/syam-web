<script>
  import { ChevronDown } from 'lucide-svelte';
  let { title, children, footer, collapsible = false, isOpen = true } = $props();
  let internalIsOpen = $state(isOpen);

  $effect(() => {
    internalIsOpen = isOpen;
  });

  function toggle() {
    if (collapsible) {
      internalIsOpen = !internalIsOpen;
    }
  }
</script>

<div class="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col overflow-hidden mb-6 transition-all hover:shadow-md">
  {#if title}
    {#if collapsible}
      <button 
        type="button"
        class="w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50/50 transition-colors" 
        onclick={toggle}
        aria-expanded={internalIsOpen}
      >
        <h3 class="m-0 text-base font-bold text-gray-900">{title}</h3>
        <div class="transition-transform duration-200 {internalIsOpen ? 'rotate-180' : ''}">
          <ChevronDown size={20} class="text-gray-400" />
        </div>
      </button>
    {:else}
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 class="m-0 text-base font-bold text-gray-900">{title}</h3>
      </div>
    {/if}
  {/if}
  
  {#if !collapsible || internalIsOpen}
    <div class="p-6 flex-1">
      {@render children()}
    </div>

    {#if footer}
      <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
        {@render footer()}
      </div>
    {/if}
  {/if}
</div>
