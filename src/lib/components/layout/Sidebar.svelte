<script>
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import { LayoutDashboard, Calculator, BookOpen, FileText, House, X } from 'lucide-svelte';
  import { i18n } from '../../stores/language.svelte.js';
  import SidebarItem from './sidebar/SidebarItem.svelte';
  import SidebarGroup from './sidebar/SidebarGroup.svelte';
  import SidebarArchiveYear from './sidebar/SidebarArchiveYear.svelte';
  import SidebarTags from './sidebar/SidebarTags.svelte';

  let { isCollapsed = false, isMobileMenuOpen = false, onClose, blogArchive = [], blogTags = [] } = $props();

  const MIN_SIDEBAR_WIDTH = 80;
  const MAX_SIDEBAR_WIDTH = 600;
  const BLOG_PATH = '/blog';
  const BLOG_ARCHIVE_PATH = '/blog/archive/';
  const BLOG_TAG_PATH = '/blog/tag/';
  const CALCULATORS_PATH = '/calculators';

  let sidebarWidth = $state(256); // Default width (w-64)
  let isResizing = $state(false);

  let isCalculatorsOpen = $state(true);
  let isBlogOpen = $state(false);
  let isTagsOpen = $state(false);
  let openYears = $state([]);

  function startResizing(event) {
    isResizing = true;
    event.preventDefault();
  }

  function getArchiveYearFromPath(pathname) {
    if (!pathname.startsWith(BLOG_ARCHIVE_PATH)) {
      return null;
    }

    const year = pathname.split('/')[3];
    return year || null;
  }

  $effect(() => {
    if (isResizing) {
      const handleMouseMove = (event) => {
        const newWidth = event.clientX;
        if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
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

    // Auto-open logic based on current route
    if (pathname.startsWith(BLOG_PATH)) {
      isBlogOpen = true;

      const archiveYear = getArchiveYearFromPath(pathname);
      if (archiveYear && !openYears.includes(archiveYear)) {
        openYears = [...openYears, archiveYear];
      }

      if (pathname.startsWith(BLOG_TAG_PATH)) {
        isTagsOpen = true;
      }
      return;
    }

    if (pathname.startsWith(CALCULATORS_PATH)) {
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
  class="bg-surface-dark text-white flex flex-col fixed inset-y-0 left-0 z-50 lg:relative lg:flex border-r border-border-dark 
    {isResizing ? '' : 'transition-[width,transform] duration-300 ease-in-out'} 
    {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}"
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
          href="/blog"
          label={i18n.t('common.blog')} 
          icon={BookOpen} 
          {isCollapsed} 
          bind:isOpen={isBlogOpen}
        >
          {#each blogArchive as { year, months }}
            <SidebarArchiveYear 
              {year} 
              {months} 
              isCollapsed={false} 
              isOpen={openYears.includes(year.toString())}
              onToggle={() => toggleYear(year)}
            />
          {/each}

          <SidebarTags 
            tags={blogTags} 
            isCollapsed={false} 
            {isBlogOpen} 
            bind:isOpen={isTagsOpen} 
          />
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
            isCollapsed={false} 
            indent={true}
          />
          <SidebarItem 
            href="/calculators/mortgage" 
            label={i18n.t('sidebar.mortgage')} 
            icon={House} 
            isCollapsed={false} 
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
