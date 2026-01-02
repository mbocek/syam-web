<script>
  import { page } from '$app/stores';
  let { isCollapsed = false } = $props();
  
  let isCalculatorsOpen = $state(true);

  function toggleCalculators() {
    isCalculatorsOpen = !isCalculatorsOpen;
  }
</script>

<aside class="bg-gray-900 text-white p-4 transition-[width] duration-300 ease-in-out overflow-hidden {isCollapsed ? 'w-20 px-2' : 'w-[250px]'}">
  <!-- Sidebar content -->
  <nav>
    <ul class="list-none p-0 m-0 flex flex-col gap-1">
      <li>
        <a 
          href="/"
          class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 {$page.url.pathname === '/' ? 'bg-gray-800 text-blue-400' : ''}"
        >
          <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">📊</span>
          {#if !isCollapsed}
            <span class="nav-text font-medium">Dashboard</span>
          {/if}
        </a>
      </li>

      <!-- Calculators Group -->
      <li>
        <button 
          onclick={toggleCalculators}
          class="w-full px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 text-white"
        >
          <span class="min-w-[24px] text-center {isCollapsed ? 'mx-auto' : ''}">🧮</span>
          {#if !isCollapsed}
            <span class="nav-text flex-1 text-left font-medium">Calculators</span>
            <span class="text-xs transition-transform duration-200 {isCalculatorsOpen ? 'rotate-180' : ''}">▼</span>
          {/if}
        </button>
        
        {#if !isCollapsed && isCalculatorsOpen}
          <ul class="list-none p-0 m-0 ml-4 mt-1 flex flex-col gap-1 border-l border-gray-700">
            <li>
              <a 
                href="/calculator"
                class="px-4 py-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 {$page.url.pathname === '/calculator' ? 'bg-gray-800 text-blue-400' : 'text-gray-400'}"
              >
                <span class="nav-text text-sm">Compound Interest</span>
              </a>
            </li>
          </ul>
        {/if}
      </li>
    </ul>
  </nav>
</aside>
