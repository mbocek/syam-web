<script>
  import { i18n } from '../../stores/language.svelte.js';

  let languages = [
    { code: 'en', flag: '🇺🇸', name: 'English', currency: '$' },
    { code: 'sk', flag: '🇸🇰', name: 'Slovenčina', currency: '€' },
    { code: 'cs', flag: '🇨🇿', name: 'Čeština', currency: 'Kč' }
  ];

  let isOpen = $state(false);

  function selectLanguage(code) {
    i18n.set(code);
    isOpen = false;
  }

  const selectedFlag = $derived(languages.find(l => l.code === i18n.current)?.flag || '🇺🇸');
</script>

<div class="relative">
  <button 
    class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800 transition-colors cursor-pointer text-xl"
    onclick={() => isOpen = !isOpen}
    aria-label={i18n.t('common.selectLanguage')}
  >
    {selectedFlag}
  </button>

  {#if isOpen}
    <div class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
      {#each languages as lang}
        <button
          class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer {i18n.current === lang.code ? 'bg-gray-50 font-semibold' : ''}"
          onclick={() => selectLanguage(lang.code)}
        >
          <span class="text-lg">{lang.flag}</span>
          <div class="flex flex-col items-start">
            <span>{lang.name} <span class="text-[10px] text-gray-400 uppercase tracking-wider">({lang.currency})</span></span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Backdrop to close the dropdown -->
    <button 
      class="fixed inset-0 z-40 bg-transparent border-none w-full h-full cursor-default" 
      onclick={() => isOpen = false}
      aria-label={i18n.t('common.closeLanguage')}
    ></button>
  {/if}
</div>
