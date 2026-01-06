<script>
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import { LayoutDashboard, Calculator, ChevronDown, BookOpen, Calendar, FileText, Dot, House, X } from 'lucide-svelte';
  import { i18n } from '../../stores/language.svelte.js';
  import SidebarItem from './sidebar/SidebarItem.svelte';
  import SidebarGroup from './sidebar/SidebarGroup.svelte';

  let { isCollapsed = false, isMobileMenuOpen = false, onClose, blogArchive = [] } = $props();

  let sidebarWidth = $state(256); // Default width (w-64)
  let isResizing = $state(false);

  let isCalculatorsOpen = $state(true);
  let isBlogOpen = $state(false);
  let openYears = $state([]);

  function startResizing(event) {
    isResizing = true;
    event.preventDefault();
  }

  $effect(() => {
    if (isResizing) {
      const handleMouseMove = (event) => {
        const newWidth = event.clientX;
        if (newWidth >= 80 && newWidth <= 600) {
          sidebarWidth = newWidth;
        }
      };
      
      const stopResizing = () => {
        isResizing = false;
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', stopResizing);
      };
    }
  });

  $effect(() => {
    const pathname = page.url.pathname;
    // Close mobile menu on navigation
    untrack(() => {
      if (isMobileMenuOpen && onClose) {
        onClose();
      }
    });

    if (pathname.startsWith('/blog')) {
      isBlogOpen = true;
      const parts = pathname.split('/');
      // /blog/archive/[year] or /blog/archive/[year]/[month]
      if (parts.length >= 4 && parts[2] === 'archive') {
        const year = parts[3].toString();
        if (!openYears.includes(year)) {
          openYears = [...openYears, year];
        }
      }
    } else if (pathname.startsWith('/calculators')) {
      isCalculatorsOpen = true;
    }
  });

  function toggleYear(year) {
    const yearStr = year.toString();
    if (openYears.includes(yearStr)) {
      openYears = openYears.filter(y => y !== yearStr);
    } else {
      openYears = [...openYears, yearStr];
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

<!-- Mobile backdrop -->
{#if isMobileMenuOpen}
  <div 
    class="fixed inset-0 bg-black/50 z-40 lg:hidden" 
    onclick={onClose}
    onkeydown={(e) => e.key === 'Escape' && onClose()}
    role="button"
    tabindex="0"
    aria-label="Close sidebar"
  ></div>
{/if}

<aside 
  class="bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-50 lg:relative lg:flex {isResizing ? '' : 'transition-[width,transform] duration-300 ease-in-out'} border-r border-gray-800 {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
  style="width: {isCollapsed ? '80px' : sidebarWidth + 'px'}"
>
  <div class="flex items-center justify-between p-4 lg:hidden">
    <span class="text-xl font-bold">SYAM</span>
    <button onclick={onClose} class="p-2 text-gray-400 hover:text-white">
      <X size={24} />
    </button>
  </div>

  <div class="flex-1 overflow-y-auto lg:overflow-y-visible py-4 px-3">
    <!-- Sidebar content -->
    <nav class="space-y-1">
      <ul>
        <SidebarItem 
          href="/" 
          label={i18n.t('common.dashboard')} 
          icon={LayoutDashboard} 
          {isCollapsed} 
        />

        <SidebarGroup 
          label={i18n.t('common.blog')} 
          icon={BookOpen} 
          {isCollapsed} 
          bind:isOpen={isBlogOpen}
        >
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
                    <SidebarItem 
                      href="/blog/archive/{year}/{month}" 
                      label={i18n.t(`month.${monthNames[month]}`)} 
                      icon={Dot} 
                      {isCollapsed} 
                      indent={true}
                    />
                  {/each}
                </ul>
              {/if}
            </li>
          {/each}
        </SidebarGroup>

        <SidebarGroup 
          label={i18n.t('common.calculators')} 
          icon={Calculator} 
          {isCollapsed} 
          bind:isOpen={isCalculatorsOpen}
        >
          <SidebarItem 
            href="/calculators/compound-interest" 
            label={i18n.t('sidebar.compoundInterest')} 
            icon={FileText} 
            {isCollapsed} 
            indent={true}
          />
          <SidebarItem 
            href="/calculators/mortgage" 
            label={i18n.t('sidebar.mortgage')} 
            icon={House} 
            {isCollapsed} 
            indent={true}
          />
        </SidebarGroup>
      </ul>
    </nav>
  </div>

  <!-- Resizer -->
  {#if !isCollapsed}
    <button
      type="button"
      aria-label="Resize sidebar"
      onmousedown={startResizing}
      class="hidden lg:block absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 {isResizing ? 'bg-blue-500' : ''}"
    ></button>
  {/if}
</aside>
