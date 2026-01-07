<script>
  import { i18n } from '../stores/language.svelte.js';
  import { APP_VERSION, COMMIT_HASH } from '$lib/version';
  import { 
    Info,
    Calculator,
    Languages,
    Cpu,
    ArrowRight
  } from 'lucide-svelte';
</script>

<div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <div class="text-center mb-16">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl lg:text-6xl">
      {i18n.t('dashboard.welcome')}
    </h1>
    <p class="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
      {i18n.t('dashboard.description')}
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
    <div class="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div class="inline-flex p-3 rounded-xl bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
        <Calculator size={32} />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">{i18n.t('common.calculators')}</h3>
      <p class="text-gray-600 leading-relaxed">{i18n.t('dashboard.features.calculators')}</p>
    </div>

    <div class="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div class="inline-flex p-3 rounded-xl bg-emerald-50 text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
        <Languages size={32} />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">{i18n.t('common.languages')}</h3>
      <p class="text-gray-600 leading-relaxed">{i18n.t('dashboard.features.multilingual')}</p>
    </div>

    <div class="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div class="inline-flex p-3 rounded-xl bg-violet-50 text-violet-600 mb-6 group-hover:scale-110 transition-transform duration-300">
        <Cpu size={32} />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-3">{i18n.t('common.technology')}</h3>
      <p class="text-gray-600 leading-relaxed">{i18n.t('dashboard.features.modern')}</p>
    </div>
  </div>

  <div class="relative overflow-hidden rounded-3xl bg-gray-900 px-8 py-12 shadow-2xl sm:px-12 sm:py-16">
    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="text-center md:text-left">
        <h3 class="text-2xl font-bold text-white sm:text-3xl">{i18n.t('common.readyToStart')}</h3>
        <p class="mt-4 text-lg text-gray-300">{i18n.t('dashboard.getStarted')}</p>
      </div>
      <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
          <Info size={24} />
        </div>
        <div class="flex flex-col">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Version</span>
          <span class="text-lg font-bold text-white">v{APP_VERSION}-{COMMIT_HASH}</span>
        </div>
      </div>
    </div>
    
    <!-- Decorative elements -->
    <div class="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>
    <div class="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl"></div>
  </div>
</div>
