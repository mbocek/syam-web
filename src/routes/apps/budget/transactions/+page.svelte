<script lang="ts">
  import { app } from '$lib/apps/budget/state/app.svelte';
  import TransactionTable from '$lib/apps/budget/components/transactions/TransactionTable.svelte';
  import { suggestRuleMatch } from '$lib/apps/budget/rules/engine';
  import { i18n } from '$lib/stores/language.svelte.js';
  import { Zap, X } from 'lucide-svelte';

  type Filter = 'all' | 'uncategorized';
  let filter = $state<Filter>('uncategorized');

  let visible = $derived(
    filter === 'uncategorized'
      ? app.workspace.transactions.filter((t) => t.categoryId == null)
      : app.workspace.transactions
  );

  let uncategorizedCount = $derived(app.workspace.transactions.filter((t) => t.categoryId == null).length);

  /** Banner suggesting a new rule after the user assigns a category. */
  let suggestion = $state<{ match: string; categoryId: number; categoryName: string } | null>(null);

  function handleAssign(id: number, categoryId: number | null) {
    app.setCategory(id, categoryId);

    if (categoryId == null) {
      suggestion = null;
      return;
    }

    const txn = app.workspace.transactions.find((t) => t.id === id);
    if (!txn) return;

    const match = suggestRuleMatch({ description: txn.description, merchant: txn.merchant });
    if (!match) {
      suggestion = null;
      return;
    }

    // Skip if an existing rule already matches this transaction.
    const haystack = `${txn.description} ${txn.merchant ?? ''}`.toLowerCase();
    const alreadyCovered = app.workspace.rules.some((r) =>
      r.match && haystack.includes(r.match.toLowerCase())
    );
    if (alreadyCovered) {
      suggestion = null;
      return;
    }

    const cat = app.workspace.categories.find((c) => c.id === categoryId);
    suggestion = { match, categoryId, categoryName: cat?.name ?? '' };
  }

  function acceptSuggestion() {
    if (!suggestion) return;
    const applied = app.addRuleFor(suggestion.match, suggestion.categoryId, true);
    suggestion = null;
    if (applied > 0) alert(i18n.t('apps.budget.rules.addResult', { count: applied }));
  }
</script>

<svelte:head>
  <title>{i18n.t('common.budget')} — {i18n.t('apps.budget.nav.transactions')} | SYAM</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-6 flex items-center justify-between gap-4 flex-wrap">
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{i18n.t('apps.budget.transactions.title')}</h1>
      <p class="mt-2 text-gray-500">
        {i18n.t('apps.budget.transactions.summary', { total: app.workspace.transactions.length, uncategorized: uncategorizedCount })}
      </p>
    </div>

    <div class="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden">
      <button
        type="button"
        onclick={() => (filter = 'uncategorized')}
        class="px-4 py-2 text-sm font-semibold transition-colors cursor-pointer {filter === 'uncategorized' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}"
      >
        {i18n.t('apps.budget.transactions.toTriage')} ({uncategorizedCount})
      </button>
      <button
        type="button"
        onclick={() => (filter = 'all')}
        class="px-4 py-2 text-sm font-semibold transition-colors cursor-pointer {filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}"
      >
        {i18n.t('apps.budget.transactions.all')}
      </button>
    </div>
  </div>

  {#if suggestion}
    <div class="mb-4 flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
      <Zap size={18} class="text-blue-600 shrink-0" />
      <span class="flex-1 text-sm text-blue-800">
        {i18n.t('apps.budget.transactions.suggestRule', { match: suggestion.match, category: suggestion.categoryName })}
      </span>
      <button
        type="button"
        onclick={acceptSuggestion}
        class="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {i18n.t('apps.budget.transactions.createRule')}
      </button>
      <button
        type="button"
        onclick={() => (suggestion = null)}
        class="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
        aria-label={i18n.t('apps.budget.transactions.dismiss')}
      >
        <X size={16} />
      </button>
    </div>
  {/if}

  <TransactionTable
    transactions={visible}
    categories={app.workspace.categories}
    onAssign={handleAssign}
  />
</div>
