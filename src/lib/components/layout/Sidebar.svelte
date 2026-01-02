<script>
  let { isCollapsed = false } = $props();
</script>

<aside class="sidebar" class:collapsed={isCollapsed}>
  <!-- Sidebar content -->
  <nav>
    <ul>
      <li>
        <span class="nav-icon">📊</span>
        <span class="nav-text">Dashboard</span>
      </li>
      <li>
        <span class="nav-icon">💰</span>
        <span class="nav-text">Sales</span>
      </li>
      <li>
        <span class="nav-icon">📈</span>
        <span class="nav-text">Analytics</span>
      </li>
    </ul>
  </nav>
</aside>

<style>
  .sidebar {
    width: 250px;
    background-color: #111827;
    color: white;
    padding: 1rem;
    transition: width 0.3s ease;
    overflow: hidden;
  }

  .sidebar.collapsed {
    width: 80px;
    padding: 1rem 0.5rem;
  }

  .sidebar.collapsed .nav-text {
    display: none;
  }

  .sidebar.collapsed .nav-icon {
    margin: 0 auto;
  }

  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  nav li {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    border-radius: 0.375rem;
  }

  nav li:hover {
    background-color: #1f2937;
  }

  .nav-icon {
    min-width: 24px;
    text-align: center;
  }
</style>
