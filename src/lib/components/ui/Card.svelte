<script>
  let { title, children, footer } = $props();
</script>

<div class="bg-white rounded-lg shadow-sm flex flex-col overflow-hidden mb-6">
  {#if title}
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="m-0 text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  {/if}
  
  <div class="p-6 flex-1">
    {@render children()}
  </div>

  {#if footer}
    <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
      {@render footer()}
    </div>
  {/if}
</div>
