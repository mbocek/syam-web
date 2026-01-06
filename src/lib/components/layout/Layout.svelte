<script>
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  import { i18n } from '../../stores/language.svelte.js';
  let { data, children } = $props();
  let isCollapsed = $state(false);
  let isMobileMenuOpen = $state(false);

  function toggleSidebar() {
    if (window.innerWidth < 1024) {
      isMobileMenuOpen = !isMobileMenuOpen;
    } else {
      isCollapsed = !isCollapsed;
    }
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }
</script>

<div class="flex h-screen w-screen overflow-hidden">
  <Sidebar 
    {isCollapsed} 
    {isMobileMenuOpen} 
    onClose={closeMobileMenu}
    blogArchive={data?.blogArchive}
    blogTags={data?.blogTags}
  />

  <div class="flex-1 flex flex-col min-w-0">
    <Header onToggleSidebar={toggleSidebar} />

    <main class="flex-1 py-6 overflow-y-auto">
      {@render children()}
    </main>

    <footer class="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
      <p>&copy; 2026 SYAM. {i18n.t('common.rightsReserved')}</p>
    </footer>
  </div>
</div>
