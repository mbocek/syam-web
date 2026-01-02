<script>
  let { onToggleSidebar } = $props();
</script>

<header class="h-[60px] bg-gray-900 text-white border-b border-gray-800 flex items-center justify-between px-6">
  <div class="flex items-center gap-4">
    <button class="bg-none border-none text-2xl cursor-pointer p-2 rounded-md text-white hover:bg-gray-800" onclick={onToggleSidebar}>☰</button>
    <div class="search-bar">Search...</div>
  </div>
  <div class="flex items-center gap-4">
    <div class="notifications">🔔</div>
    <div class="user-profile">Profile</div>
  </div>
</header>
