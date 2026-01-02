<script>
  let { isCollapsed = false } = $props();
</script>

<aside class="bg-[#111827] text-white p-4 transition-[width] duration-300 ease-in-out overflow-hidden {isCollapsed ? 'w-20 px-2' : 'w-[250px]'}">
  <!-- Sidebar content -->
  <nav>
    <ul class="list-none p-0 m-0">
      <li class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-[#1f2937]">
        <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">📊</span>
        {#if !isCollapsed}
          <span class="nav-text">Dashboard</span>
        {/if}
      </li>
      <li class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-[#1f2937]">
        <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">💰</span>
        {#if !isCollapsed}
          <span class="nav-text">Sales</span>
        {/if}
      </li>
      <li class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-[#1f2937]">
        <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">📈</span>
        {#if !isCollapsed}
          <span class="nav-text">Analytics</span>
        {/if}
      </li>
    </ul>
  </nav>
</aside>
