<script>
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  let { children } = $props();
  let isCollapsed = $state(false);

  function toggleSidebar() {
    isCollapsed = !isCollapsed;
  }
</script>

<div class="layout" class:sidebar-collapsed={isCollapsed}>
  <Sidebar {isCollapsed} />

  <div class="main-content">
    <Header onToggleSidebar={toggleSidebar} />

    <main class="content">
      {@render children()}
    </main>

    <footer class="footer">
      <p>&copy; 2026 SYAM. All rights reserved.</p>
    </footer>
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Inter', sans-serif;
    background-color: #f3f4f6;
    height: 100vh;
    overflow: hidden;
  }

  :global(#app) {
    height: 100%;
  }

  .layout {
    display: flex;
    height: 100vh;
    width: 100vw;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* Prevent layout breaking with long content */
  }

  .content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .footer {
    padding: 1rem 1.5rem;
    background-color: white;
    border-top: 1px solid #e5e7eb;
    text-align: center;
    font-size: 0.875rem;
    color: #6b7280;
  }
</style>
