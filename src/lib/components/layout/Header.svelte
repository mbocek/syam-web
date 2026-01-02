<script>
  import { Menu } from 'lucide-svelte';
  let { onToggleSidebar } = $props();
</script>

<header class="h-[60px] bg-gray-900 text-white border-b border-gray-800 flex items-center justify-between px-6">
  <div class="flex items-center gap-4">
    <button 
      class="bg-none border-none cursor-pointer p-2 rounded-md text-white hover:bg-gray-800 transition-colors" 
      onclick={onToggleSidebar}
      aria-label="Toggle Sidebar"
    >
      <Menu size={24} />
    </button>
  </div>
  <div class="flex items-center gap-4"></div>
</header>
