<script lang="ts">
  import { app } from '$lib/apps/budget/state/app.svelte';
  import { formatCents, parseAmountToCents } from '$lib/apps/budget/utils/money';
  import { i18n } from '$lib/stores/language.svelte.js';
  import { Plus, Pencil, Trash2, Check, X } from 'lucide-svelte';
  import type { Category } from '$lib/apps/budget/types';

  type DraftKind = Category['kind'];

  // --- New category form ---
  let newName = $state('');
  let newKind = $state<DraftKind>('expense');
  let newTarget = $state('');

  let canAdd = $derived(newName.trim().length > 0);

  function addCategory() {
    if (!canAdd) return;
    app.addCategory({
      name: newName.trim(),
      kind: newKind,
      monthlyBudgetCents: parseOptionalCents(newTarget)
    });
    newName = '';
    newKind = 'expense';
    newTarget = '';
  }

  // --- Inline edit ---
  let editingId = $state<number | null>(null);
  let editName = $state('');
  let editKind = $state<DraftKind>('expense');
  let editTarget = $state('');

  function beginEdit(c: Category) {
    editingId = c.id;
    editName = c.name;
    editKind = c.kind;
    editTarget = c.monthlyBudgetCents == null ? '' : (c.monthlyBudgetCents / 100).toString();
  }

  function cancelEdit() {
    editingId = null;
  }

  function saveEdit() {
    if (editingId == null || editName.trim().length === 0) return;
    app.updateCategory(editingId, {
      name: editName.trim(),
      kind: editKind,
      monthlyBudgetCents: parseOptionalCents(editTarget)
    });
    editingId = null;
  }

  function remove(c: Category) {
    if (!confirm(i18n.t('apps.budget.categories.confirmDelete', { name: c.name }))) return;
    app.deleteCategory(c.id);
  }

  /** Parse the user's optional-target input. Empty → null target. */
  function parseOptionalCents(raw: string): number | null {
    const t = raw.trim();
    if (!t) return null;
    try {
      return parseAmountToCents(t);
    } catch {
      return null;
    }
  }

  function kindLabel(k: DraftKind): string {
    return i18n.t(`apps.budget.categories.kind${k[0].toUpperCase() + k.slice(1)}`);
  }
</script>

<svelte:head>
  <title>{i18n.t('common.budget')} — {i18n.t('apps.budget.nav.categories')} | SYAM</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-8">
    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{i18n.t('apps.budget.categories.title')}</h1>
    <p class="mt-2 text-gray-500">{i18n.t('apps.budget.categories.subtitle')}</p>
  </div>

  <!-- New category form -->
  <div class="mb-6 p-5 bg-white rounded-xl border border-gray-200">
    <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
      {i18n.t('apps.budget.categories.newTitle')}
    </h2>
    <form onsubmit={(e) => { e.preventDefault(); addCategory(); }} class="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-end">
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium text-gray-700">{i18n.t('apps.budget.categories.colName')}</span>
        <input
          type="text"
          bind:value={newName}
          placeholder={i18n.t('apps.budget.categories.namePlaceholder')}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium text-gray-700">{i18n.t('apps.budget.categories.colKind')}</span>
        <select
          bind:value={newKind}
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
        >
          <option value="expense">{i18n.t('apps.budget.categories.kindExpense')}</option>
          <option value="income">{i18n.t('apps.budget.categories.kindIncome')}</option>
          <option value="savings">{i18n.t('apps.budget.categories.kindSavings')}</option>
        </select>
      </label>
      <label class="flex flex-col gap-1 text-sm">
        <span class="font-medium text-gray-700">{i18n.t('apps.budget.categories.colTarget')}</span>
        <input
          type="text"
          bind:value={newTarget}
          placeholder={i18n.t('apps.budget.categories.targetPlaceholder')}
          inputmode="decimal"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
      </label>
      <button
        type="submit"
        disabled={!canAdd}
        class="inline-flex items-center justify-center gap-2 px-4 py-2 h-10 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Plus size={16} />
        {i18n.t('apps.budget.categories.add')}
      </button>
    </form>
  </div>

  <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
    <table class="w-full text-sm text-left">
      <thead class="bg-gray-50 border-b border-gray-200">
        <tr>
          <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.categories.colName')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.categories.colKind')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600 text-right">{i18n.t('apps.budget.categories.colTarget')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600 text-right">{i18n.t('apps.budget.categories.colActions')}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each app.workspace.categories as c (c.id)}
          {#if editingId === c.id}
            <tr class="bg-blue-50/40">
              <td class="px-4 py-3">
                <input
                  type="text"
                  bind:value={editName}
                  class="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </td>
              <td class="px-4 py-3">
                <select
                  bind:value={editKind}
                  class="w-full px-2 py-1 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="expense">{i18n.t('apps.budget.categories.kindExpense')}</option>
                  <option value="income">{i18n.t('apps.budget.categories.kindIncome')}</option>
                  <option value="savings">{i18n.t('apps.budget.categories.kindSavings')}</option>
                </select>
              </td>
              <td class="px-4 py-3">
                <input
                  type="text"
                  bind:value={editTarget}
                  inputmode="decimal"
                  placeholder="—"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-1">
                  <button
                    type="button"
                    onclick={saveEdit}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                    aria-label={i18n.t('apps.budget.categories.save')}
                    title={i18n.t('apps.budget.categories.save')}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    type="button"
                    onclick={cancelEdit}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:bg-gray-100 cursor-pointer"
                    aria-label={i18n.t('apps.budget.categories.cancel')}
                    title={i18n.t('apps.budget.categories.cancel')}
                  >
                    <X size={16} />
                  </button>
                </div>
              </td>
            </tr>
          {:else}
            <tr class="hover:bg-gray-50">
              <td class="px-4 py-3 font-semibold text-gray-900">{c.name}</td>
              <td class="px-4 py-3 text-gray-500">{kindLabel(c.kind)}</td>
              <td class="px-4 py-3 text-right text-gray-700">
                {c.monthlyBudgetCents != null ? formatCents(c.monthlyBudgetCents) : '—'}
              </td>
              <td class="px-4 py-3">
                <div class="flex justify-end gap-1">
                  <button
                    type="button"
                    onclick={() => beginEdit(c)}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer"
                    aria-label={i18n.t('apps.budget.categories.edit')}
                    title={i18n.t('apps.budget.categories.edit')}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onclick={() => remove(c)}
                    class="inline-flex items-center justify-center w-8 h-8 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                    aria-label={i18n.t('apps.budget.categories.delete')}
                    title={i18n.t('apps.budget.categories.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          {/if}
        {/each}
      </tbody>
    </table>
  </div>
</div>
