<script>
  import { page } from '$app/stores';
  import { LayoutDashboard, Calculator, ChevronDown } from 'lucide-svelte';
  import { t } from '../../stores/language.js';
  let { isCollapsed = false } = $props();
  
  let isCalculatorsOpen = $state(true);

  function toggleCalculators() {
    isCalculatorsOpen = !isCalculatorsOpen;
  }
</script>

<aside class="bg-gray-900 text-white p-4 transition-[width] duration-300 ease-in-out overflow-hidden {isCollapsed ? 'w-20 px-2' : 'w-[250px]'} border-r border-gray-800">
  <!-- Sidebar content -->
  <nav>
    <ul class="list-none p-0 m-0 flex flex-col gap-1">
      <li>
        <a 
          href="/"
          class="px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 transition-all {$page.url.pathname === '/' ? 'bg-gray-800 text-blue-400' : 'text-gray-400 hover:text-white'}"
        >
          <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : ''}">
            <LayoutDashboard size={20} />
          </div>
          {#if !isCollapsed}
            <span class="nav-text font-medium">{$t('common.dashboard')}</span>
          {/if}
        </a>
      </li>

      <!-- Calculators Group -->
      <li>
        <button 
          onclick={toggleCalculators}
          class="w-full px-4 py-3 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-all"
        >
          <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : ''}">
            <Calculator size={20} />
          </div>
          {#if !isCollapsed}
            <span class="nav-text flex-1 text-left font-medium">{$t('common.calculators')}</span>
            <div class="transition-transform duration-200 {isCalculatorsOpen ? 'rotate-180' : ''}">
              <ChevronDown size={16} />
            </div>
          {/if}
        </button>
        
        {#if !isCollapsed && isCalculatorsOpen}
          <ul class="list-none p-0 m-0 ml-6 mt-1 flex flex-col gap-1 border-l border-gray-800">
            <li>
              <a 
                href="/calculator"
                class="px-4 py-2 flex items-center gap-3 cursor-pointer rounded-md hover:bg-gray-800 transition-all {$page.url.pathname === '/calculator' ? 'bg-gray-800 text-blue-400' : 'text-gray-500 hover:text-white'}"
              >
                <span class="nav-text text-sm font-medium">{$t('sidebar.compoundInterest')}</span>
              </a>
            </li>
          </ul>
        {/if}
      </li>
    </ul>
  </nav>
</aside>
