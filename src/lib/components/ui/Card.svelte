<script>
  let { title, children, footer } = $props();
</script>

<div class="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col overflow-hidden mb-6 transition-all hover:shadow-md">
  {#if title}
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <h3 class="m-0 text-base font-bold text-gray-900">{title}</h3>
    </div>
  {/if}
  
  <div class="p-6 flex-1">
    {@render children()}
  </div>

  {#if footer}
    <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100">
      {@render footer()}
    </div>
  {/if}
</div>
