<script lang="ts">
  import { app } from '$lib/apps/budget/state/app.svelte';
  import { i18n } from '$lib/stores/language.svelte.js';
  import { Trash2, Plus } from 'lucide-svelte';

  let matchInput = $state('');
  let categoryInput = $state<number | ''>('');
  let applyToExisting = $state(true);

  let canSubmit = $derived(matchInput.trim().length > 0 && categoryInput !== '');

  function categoryName(id: number): string {
    return app.workspace.categories.find((c) => c.id === id)?.name ?? '?';
  }

  function add() {
    if (!canSubmit || categoryInput === '') return;
    const applied = app.addRuleFor(matchInput.trim(), Number(categoryInput), applyToExisting);
    if (applyToExisting) alert(i18n.t('apps.budget.rules.addResult', { count: applied }));
    matchInput = '';
    categoryInput = '';
  }

  function remove(id: number) {
    if (!confirm(i18n.t('apps.budget.rules.confirmDelete'))) return;
    app.deleteRule(id);
  }

  function reapply() {
    const n = app.reapplyAllRules();
    alert(i18n.t('apps.budget.rules.reapplyResult', { count: n }));
  }
</script>

<svelte:head>
  <title>{i18n.t('common.budget')} — {i18n.t('apps.budget.nav.rules')} | SYAM</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-8 flex items-end justify-between gap-4 flex-wrap">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{i18n.t('apps.budget.rules.title')}</h1>
      <p class="mt-2 text-gray-500">{i18n.t('apps.budget.rules.subtitle')}</p>
    </div>
    <button
      type="button"
      onclick={reapply}
      class="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={app.workspace.rules.length === 0}
    >
      {i18n.t('apps.budget.rules.reapply')}
    </button>
  </div>

  <!-- New rule form -->
  <div class="mb-6 p-5 bg-white rounded-xl border border-gray-200">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
      {i18n.t('apps.budget.rules.formTitle')}
    </h2>
    <form onsubmit={(e) => { e.preventDefault(); add(); }} class="flex flex-col gap-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium text-gray-700">{i18n.t('apps.budget.rules.matchLabel')}</span>
          <input
            type="text"
            bind:value={matchInput}
            placeholder={i18n.t('apps.budget.rules.matchPlaceholder')}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </label>
        <label class="flex flex-col gap-1 text-sm">
          <span class="font-medium text-gray-700">{i18n.t('apps.budget.rules.categoryLabel')}</span>
          <select
            bind:value={categoryInput}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
          >
            <option value="">— {i18n.t('apps.budget.rules.categoryPlaceholder')} —</option>
            {#each app.workspace.categories as c}
              <option value={c.id}>{c.name}</option>
            {/each}
          </select>
        </label>
      </div>
      <div class="flex items-center justify-between flex-wrap gap-3">
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" bind:checked={applyToExisting} class="rounded" />
          {i18n.t('apps.budget.rules.applyToExisting')}
        </label>
        <button
          type="submit"
          disabled={!canSubmit}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          {i18n.t('apps.budget.rules.add')}
        </button>
      </div>
    </form>
  </div>

  {#if app.workspace.rules.length === 0}
    <div class="text-center py-12 text-gray-500">
      {i18n.t('apps.budget.rules.empty')}
    </div>
  {:else}
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.rules.colMatch')}</th>
            <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.rules.colCategory')}</th>
            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{i18n.t('apps.budget.rules.colHits')}</th>
            <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.rules.colCreated')}</th>
            <th class="px-4 py-3 font-semibold text-gray-600 text-right">{i18n.t('apps.budget.rules.colActions')}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each app.workspace.rules as r (r.id)}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3 font-mono text-xs text-gray-800">{r.match}</td>
              <td class="px-4 py-3 text-gray-700">{categoryName(r.categoryId)}</td>
              <td class="px-4 py-3 text-right text-gray-500">{r.hitCount}</td>
              <td class="px-4 py-3 text-gray-500">{r.createdAt}</td>
              <td class="px-4 py-3 text-right">
                <button
                  type="button"
                  onclick={() => remove(r.id)}
                  class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  aria-label={i18n.t('apps.budget.rules.delete')}
                  title={i18n.t('apps.budget.rules.delete')}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
