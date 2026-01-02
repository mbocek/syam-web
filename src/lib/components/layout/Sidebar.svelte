<script>
  import { page } from '$app/stores';
  let { isCollapsed = false } = $props();
</script>

<aside class="bg-gray-900 text-white p-4 transition-[width] duration-300 ease-in-out overflow-hidden {isCollapsed ? 'w-20 px-2' : 'w-[250px]'}">
  <!-- Sidebar content -->
  <nav>
    <ul class="list-none p-0 m-0">
      <li>
        <a 
          href="/"
          class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 {$page.url.pathname === '/' ? 'bg-gray-800 text-blue-400' : ''}"
        >
          <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">📊</span>
          {#if !isCollapsed}
            <span class="nav-text">Dashboard</span>
          {/if}
        </a>
      </li>
      <li>
        <a 
          href="/calculator"
          class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 {$page.url.pathname === '/calculator' ? 'bg-gray-800 text-blue-400' : ''}"
        >
          <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">🧮</span>
          {#if !isCollapsed}
            <span class="nav-text">Calculator</span>
          {/if}
        </a>
      </li>
      <li class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800">
        <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">💰</span>
        {#if !isCollapsed}
          <span class="nav-text">Sales</span>
        {/if}
      </li>
      <li class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800">
        <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">📈</span>
        {#if !isCollapsed}
          <span class="nav-text">Analytics</span>
        {/if}
      </li>
    </ul>
  </nav>
</aside>
