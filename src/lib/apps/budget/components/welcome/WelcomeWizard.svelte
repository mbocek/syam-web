<script lang="ts">
  import { onMount } from 'svelte';
  import { FolderOpen, FilePlus, AlertTriangle, ShieldCheck, Loader2, ArrowRight } from 'lucide-svelte';
  import { app } from '$lib/apps/budget/state/app.svelte';
  import { isFsAccessSupported, pickOpenHandle, pickSaveHandle } from '$lib/apps/budget/storage/fsAccess';
  import { i18n } from '$lib/stores/language.svelte.js';

  type Step = 'checking' | 'unsupported' | 'intro' | 'working' | 'resumed';

  let step = $state<Step>('checking');
  let error = $state<string | null>(null);

  onMount(async () => {
    if (!isFsAccessSupported()) {
      step = 'unsupported';
      return;
    }
    const resumed = await app.resumeLastSession();
    step = resumed ? 'resumed' : 'intro';
  });

  async function createNew() {
    error = null;
    step = 'working';
    try {
      const handle = await pickSaveHandle('budget.db');
      await app.createNewAt(handle);
    } catch (e) {
      if (isAbortError(e)) {
        step = 'intro';
        return;
      }
      error = e instanceof Error ? e.message : String(e);
      step = 'intro';
    }
  }

  async function openExisting() {
    error = null;
    step = 'working';
    try {
      const handle = await pickOpenHandle();
      await app.openExisting(handle);
    } catch (e) {
      if (isAbortError(e)) {
        step = 'intro';
        return;
      }
      error = e instanceof Error ? e.message : String(e);
      step = 'intro';
    }
  }

  function isAbortError(e: unknown): boolean {
    return typeof e === 'object' && e !== null && 'name' in e && (e as { name: string }).name === 'AbortError';
  }
</script>

<div class="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
  <div class="bg-white rounded-2xl shadow-card border border-border-primary p-8 sm:p-12">
    {#if step === 'checking'}
      <div class="flex items-center justify-center py-16 text-gray-500">
        <Loader2 size={32} class="animate-spin mr-3" />
        <span>{i18n.t('apps.budget.welcome.checking')}</span>
      </div>
    {:else if step === 'unsupported'}
      <div class="text-center">
        <AlertTriangle size={48} class="text-amber-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold mb-3">{i18n.t('apps.budget.welcome.unsupportedTitle')}</h1>
        <p class="text-gray-600 leading-relaxed">{i18n.t('apps.budget.welcome.unsupportedText')}</p>
      </div>
    {:else if step === 'working'}
      <div class="flex items-center justify-center py-16 text-gray-500">
        <Loader2 size={32} class="animate-spin mr-3" />
        <span>{i18n.t('apps.budget.welcome.working')}</span>
      </div>
    {:else}
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 mb-4">
          <ShieldCheck size={32} />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight">{i18n.t('apps.budget.welcome.introTitle')}</h1>
        <p class="mt-3 text-gray-600 leading-relaxed">{i18n.t('apps.budget.welcome.introText')}</p>
      </div>

      {#if error}
        <div class="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      {/if}

      {#if step === 'resumed'}
        <p class="text-emerald-700 text-sm text-center mb-4">
          {i18n.t('apps.budget.welcome.resumed')}
        </p>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onclick={createNew}
            class="group flex flex-col items-start gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors text-left cursor-pointer"
          >
            <FilePlus size={28} class="text-blue-600" />
            <div>
              <div class="font-bold text-gray-900">{i18n.t('apps.budget.welcome.createTitle')}</div>
              <div class="text-sm text-gray-600 mt-1">{i18n.t('apps.budget.welcome.createDesc')}</div>
            </div>
            <div class="flex items-center text-blue-600 text-sm font-semibold mt-1 group-hover:translate-x-1 transition-transform">
              {i18n.t('apps.budget.welcome.createAction')} <ArrowRight size={14} class="ml-1" />
            </div>
          </button>

          <button
            type="button"
            onclick={openExisting}
            class="group flex flex-col items-start gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-colors text-left cursor-pointer"
          >
            <FolderOpen size={28} class="text-emerald-600" />
            <div>
              <div class="font-bold text-gray-900">{i18n.t('apps.budget.welcome.openTitle')}</div>
              <div class="text-sm text-gray-600 mt-1">{i18n.t('apps.budget.welcome.openDesc')}</div>
            </div>
            <div class="flex items-center text-emerald-600 text-sm font-semibold mt-1 group-hover:translate-x-1 transition-transform">
              {i18n.t('apps.budget.welcome.openAction')} <ArrowRight size={14} class="ml-1" />
            </div>
          </button>
        </div>

        <p class="text-xs text-gray-400 text-center mt-6">
          {i18n.t('apps.budget.welcome.permissionNote')}
        </p>
      {/if}
    {/if}
  </div>
</div>
