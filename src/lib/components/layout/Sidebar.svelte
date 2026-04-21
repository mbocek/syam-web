<script>
  import { page } from '$app/state';
  import { untrack } from 'svelte';
  import { LayoutDashboard, Calculator, BookOpen, FileText, House, X, AppWindow, Wallet, LayoutGrid, ListChecks, Upload, Tags, Workflow } from 'lucide-svelte';
  import { i18n } from '../../stores/language.svelte.js';
  import SidebarItem from './sidebar/SidebarItem.svelte';
  import SidebarGroup from './sidebar/SidebarGroup.svelte';
  import SidebarArchiveYear from './sidebar/SidebarArchiveYear.svelte';
  import SidebarTags from './sidebar/SidebarTags.svelte';

  let { isCollapsed = false, isMobileMenuOpen = false, onClose, blogArchive = [], blogTags = [] } = $props();

  const MIN_SIDEBAR_WIDTH = 80;
  const MAX_SIDEBAR_WIDTH = 600;

  let sidebarWidth = $state(256);
  let isResizing = $state(false);

  function startResizing(event) {
    isResizing = true;
    event.preventDefault();
  }

  $effect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event) => {
      const w = event.clientX;
      if (w >= MIN_SIDEBAR_WIDTH && w <= MAX_SIDEBAR_WIDTH) sidebarWidth = w;
    };
    const stopResizing = () => (isResizing = false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResizing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  });

  // Close the mobile menu on navigation.
  $effect(() => {
    page.url.pathname;
    untrack(() => {
      if (isMobileMenuOpen && onClose) onClose();
    });
  });
</script>

{#if isMobileMenuOpen}
  <button
    type="button"
    onclick={onClose}
    class="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-default"
    aria-label="Close sidebar"
  ></button>
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
    <nav>
      <ul class="space-y-1">
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
        >
          {#each blogArchive as { year, months }}
            <SidebarArchiveYear {year} {months} isCollapsed={false} />
          {/each}

          <SidebarTags tags={blogTags} isCollapsed={false} />
        </SidebarGroup>

        <SidebarGroup
          label={i18n.t('common.calculators')}
          icon={Calculator}
          autoOpenPath="/calculators"
          {isCollapsed}
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

        <SidebarGroup
          label={i18n.t('common.applications')}
          icon={AppWindow}
          autoOpenPath="/apps"
          {isCollapsed}
        >
          <SidebarGroup
            href="/apps/budget"
            label={i18n.t('common.budget')}
            icon={Wallet}
            isCollapsed={false}
          >
            <SidebarItem
              href="/apps/budget"
              label={i18n.t('apps.budget.nav.dashboard')}
              icon={LayoutGrid}
              isCollapsed={false}
              indent={true}
              exact={true}
            />
            <SidebarItem
              href="/apps/budget/transactions"
              label={i18n.t('apps.budget.nav.transactions')}
              icon={ListChecks}
              isCollapsed={false}
              indent={true}
            />
            <SidebarItem
              href="/apps/budget/import"
              label={i18n.t('apps.budget.nav.import')}
              icon={Upload}
              isCollapsed={false}
              indent={true}
            />
            <SidebarItem
              href="/apps/budget/categories"
              label={i18n.t('apps.budget.nav.categories')}
              icon={Tags}
              isCollapsed={false}
              indent={true}
            />
            <SidebarItem
              href="/apps/budget/rules"
              label={i18n.t('apps.budget.nav.rules')}
              icon={Workflow}
              isCollapsed={false}
              indent={true}
            />
          </SidebarGroup>
        </SidebarGroup>
      </ul>
    </nav>
  </div>

  {#if !isCollapsed}
    <button
      type="button"
      aria-label="Resize sidebar"
      onmousedown={startResizing}
      class="hidden lg:block absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 transition-colors z-50 {isResizing ? 'bg-blue-500' : ''}"
    ></button>
  {/if}
</aside>
