<script>
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  let { children } = $props();
  let isCollapsed = $state(false);

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }
</script>

<div class="flex h-screen w-screen">
  <Sidebar {isCollapsed} />

  <div class="flex-1 flex flex-col min-w-0">
    <Header onToggleSidebar={toggleSidebar} />

    <main class="flex-1 p-6 overflow-y-auto">
      {@render children()}
    </main>

    <footer class="p-4 bg-white border-t border-gray-200 text-center text-sm text-gray-500">
      <p>&copy; 2026 SYAM. All rights reserved.</p>
    </footer>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
    @reference "tailwindcss";
    @apply bg-gray-100 h-screen overflow-hidden;
  }

  :global(#app) {
    height: 100%;
  }
</style>
