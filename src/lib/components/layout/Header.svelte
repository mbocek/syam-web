<script>
  import { Menu } from 'lucide-svelte';
  import LanguageSelector from '../ui/LanguageSelector.svelte';
  import { i18n } from '../../stores/language.svelte.js';
  let { onToggleSidebar } = $props();
</script>

<header class="h-[60px] bg-surface-dark text-white border-b border-border-dark flex items-center justify-between px-4 lg:px-6">
  <div class="flex items-center gap-4">
    <button 
      class="bg-none border-none cursor-pointer p-2 rounded-md text-white hover:bg-white/10 transition-colors" 
      onclick={onToggleSidebar}
      aria-label={i18n.t('common.toggleSidebar')}
    >
      <Menu size={24} />
    </button>
    <span class="text-xl font-bold lg:hidden">SYAM</span>
  </div>
  <div class="flex items-center gap-4">
    <LanguageSelector />
  </div>
</header>
