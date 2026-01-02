<script>
  let { onToggleSidebar } = $props();
</script>

<header class="header">
  <div class="header-left">
    <button class="toggle-sidebar" onclick={onToggleSidebar}>☰</button>
    <div class="search-bar">Search...</div>
  </div>
  <div class="header-right">
    <div class="notifications">🔔</div>
    <div class="user-profile">Profile</div>
  </div>
</header>

<style>
  .header {
    height: 60px;
    background-color: #111827;
    color: white;
    border-bottom: 1px solid #1f2937;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
  }

  .toggle-sidebar {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.375rem;
    color: white;
  }

  .toggle-sidebar:hover {
    background-color: #1f2937;
  }

  .header-left, .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
