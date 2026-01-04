<script>
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import { LayoutDashboard, Calculator, ChevronDown, BookOpen, Calendar, FileText, Dot, House } from 'lucide-svelte';
  import { i18n } from '../../stores/language.svelte.js';
  let { isCollapsed = false, blogArchive = [] } = $props();

  let sidebarWidth = $state(256); // Default width (w-64)
  let isResizing = $state(false);

  let isCalculatorsOpen = $state(true);
  let isBlogOpen = $state(false);
  let openYears = $state([]);

  function startResizing(event) {
    isResizing = true;
    event.preventDefault();
  }

  function stopResizing() {
    isResizing = false;
  }

  function handleMouseMove(event) {
    if (isResizing) {
      const newWidth = event.clientX;
      if (newWidth >= 80 && newWidth <= 600) {
        sidebarWidth = newWidth;
      }
    }
  }

  $effect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  });

  $effect(() => {
    const pathname = page.url.pathname;
    if (pathname.startsWith('/blog')) {
      isBlogOpen = true;
      const parts = pathname.split('/');
      // /blog/archive/[year] or /blog/archive/[year]/[month]
      if (parts.length >= 4 && parts[2] === 'archive') {
        const year = parts[3].toString();
        if (!openYears.includes(year)) {
          openYears.push(year);
        }
      }
    }
  });

  function toggleCalculators() {
    isCalculatorsOpen = !isCalculatorsOpen;
  }

  function toggleBlog() {
    isBlogOpen = !isBlogOpen;
  }

  function toggleYear(year) {
    const yearStr = year.toString();
    if (openYears.includes(yearStr)) {
      const index = openYears.indexOf(yearStr);
      openYears.splice(index, 1);
    } else {
      openYears.push(yearStr);
    }
  }

  const monthNames = {
    1: 'january',
    2: 'february',
    3: 'march',
    4: 'april',
    5: 'may',
    6: 'june',
    7: 'july',
    8: 'august',
    9: 'september',
    10: 'october',
    11: 'november',
    12: 'december'
  };
</script>

<aside 
  class="bg-gray-900 text-white flex flex-col relative {isResizing ? '' : 'transition-[width] duration-300 ease-in-out'} border-r border-gray-800"
  style="width: {isCollapsed ? '80px' : sidebarWidth + 'px'}"
>
  <div class="flex-1 overflow-y-visible py-4 px-3 {isCollapsed ? '' : ''}">
    <!-- Sidebar content -->
    <nav class="space-y-1">
      <ul>
        <li class="relative group">
          <a 
            href="/"
            class="group/link flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 {page.url.pathname === '/' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
          >
            <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
              <LayoutDashboard size={20} class="transition-colors {page.url.pathname === '/' ? 'text-blue-400' : 'text-gray-400 group-hover/link:text-white'}" />
            </div>
            {#if !isCollapsed}
              <span>{i18n.t('common.dashboard')}</span>
            {:else}
              <div class="hidden group-hover:block absolute left-[52px] top-0 ml-0 bg-gray-900 border border-gray-800 rounded-lg py-2 px-3 shadow-xl z-50 whitespace-nowrap">
                <span class="text-sm font-medium text-white">{i18n.t('common.dashboard')}</span>
              </div>
            {/if}
          </a>
        </li>

        <li class="pt-4 pb-1 relative group">
          <div class="flex flex-col">
            <div class="flex items-center">
              <a 
                href="/blog"
                onclick={() => {
                  if (!isCollapsed) {
                    isBlogOpen = !isBlogOpen;
                  }
                }}
                class="flex-1 flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 {page.url.pathname === '/blog' ? 'bg-blue-600/10 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
              >
                <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
                  <BookOpen size={20} class="transition-colors {page.url.pathname === '/blog' ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}" />
                </div>
                {#if !isCollapsed}
                  <span>{i18n.t('common.blog')}</span>
                {/if}
              </a>
              {#if !isCollapsed && blogArchive.length > 0}
                <button 
                  onclick={toggleBlog}
                  class="p-2 ml-1 text-gray-500 hover:text-white transition-all rounded-md hover:bg-gray-800"
                >
                  <div class="transition-transform duration-300 {isBlogOpen ? 'rotate-180' : ''}">
                    <ChevronDown size={16} />
                  </div>
                </button>
              {/if}
            </div>

            {#if blogArchive.length > 0}
              <ul class="mt-1 space-y-1 {isCollapsed ? 'hidden group-hover:block absolute left-[52px] top-0 ml-0 w-48 bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-xl z-50' : (isBlogOpen ? 'ml-4 border-l border-gray-800' : 'hidden')}">
                {#if isCollapsed}
                  <li class="px-3 py-2 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800">
                    {i18n.t('common.blog')}
                  </li>
                {/if}
                {#each blogArchive as { year, months }}
                  <li class="flex flex-col">
                    <div class="flex items-center group/year">
                        <a 
                        href="/blog/archive/{year}"
                        class="flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center {page.url.pathname.startsWith(`/blog/archive/${year}`) ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'} {!isCollapsed ? 'ml-2' : ''}"
                      >
                        <Calendar size={14} class="mr-2 opacity-70" />
                        {year}
                      </a>
                      {#if !isCollapsed}
                        <button 
                          onclick={() => toggleYear(year)}
                          class="p-1.5 text-gray-600 hover:text-white transition-all rounded-md hover:bg-gray-800"
                        >
                          <div class="transition-transform duration-300 {openYears.includes(year.toString()) ? 'rotate-180' : ''}">
                            <ChevronDown size={14} />
                          </div>
                        </button>
                      {/if}
                    </div>
                    
                    {#if isCollapsed || openYears.includes(year.toString())}
                      <ul class="mt-1 space-y-1 {isCollapsed ? 'ml-4' : 'ml-4 border-l border-gray-800'}">
                        {#each months as month}
                          <li>
                            <a 
                              href="/blog/archive/{year}/{month}"
                              class="px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center {page.url.pathname === `/blog/archive/${year}/${month}` ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'} {!isCollapsed ? 'ml-2' : ''}"
                            >
                              <Dot size={14} class="mr-1 opacity-50" />
                              {i18n.t(`month.${monthNames[month]}`)}
                            </a>
                          </li>
                        {/each}
                      </ul>
                    {/if}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </li>

        <!-- Calculators Group -->
        <li class="pt-4 pb-1 relative group">
          {#if !isCollapsed}
            <div class="px-3 mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
              {i18n.t('common.calculators')}
            </div>
          {/if}
          <button 
            onclick={toggleCalculators}
            class="w-full flex items-center px-3 py-2 text-base font-medium rounded-lg transition-all duration-200 {isCalculatorsOpen && !isCollapsed ? 'text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}"
          >
            <div class="flex items-center justify-center {isCollapsed ? 'mx-auto' : 'mr-3'}">
              <Calculator size={20} class="transition-colors {isCalculatorsOpen && !isCollapsed ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}" />
            </div>
            {#if !isCollapsed}
              <span class="flex-1 text-left">{i18n.t('common.calculators')}</span>
              <div class="transition-transform duration-300 {isCalculatorsOpen ? 'rotate-180' : ''}">
                <ChevronDown size={16} class="text-gray-500" />
              </div>
            {/if}
          </button>
          
          <ul class="mt-1 space-y-1 {isCollapsed ? 'hidden group-hover:block absolute left-[52px] top-0 ml-0 w-48 bg-gray-900 border border-gray-800 rounded-lg p-2 shadow-xl z-50' : (isCalculatorsOpen ? 'ml-4 border-l border-gray-800' : 'hidden')}">
            {#if isCollapsed}
              <li class="px-3 py-2 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800">
                {i18n.t('common.calculators')}
              </li>
            {/if}
            <li>
              <a 
                href="/calculator"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center {page.url.pathname === '/calculator' ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'} {!isCollapsed ? 'ml-2' : ''}"
              >
                <FileText size={14} class="mr-2 opacity-70" />
                {i18n.t('sidebar.compoundInterest')}
              </a>
            </li>
            <li>
              <a 
                href="/mortgage"
                class="px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center {page.url.pathname === '/mortgage' ? 'text-blue-400' : 'text-gray-500 hover:bg-gray-800 hover:text-gray-300'} {!isCollapsed ? 'ml-2' : ''}"
              >
                <House size={14} class="mr-2 opacity-70" />
                {i18n.t('sidebar.mortgage')}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>

  <!-- Resizer -->
  {#if !isCollapsed}
    <button
      type="button"
      aria-label="Resize sidebar"
      onmousedown={startResizing}
      class="absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 {isResizing ? 'bg-blue-500' : ''}"
    ></button>
  {/if}
</aside>
