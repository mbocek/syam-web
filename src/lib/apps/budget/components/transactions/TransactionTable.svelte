<script lang="ts">
  import type { Category, Transaction } from '$lib/apps/budget/types';
  import { formatCents } from '$lib/apps/budget/utils/money';
  import { i18n } from '$lib/stores/language.svelte.js';

  let {
    transactions,
    categories,
    onAssign
  }: {
    transactions: Transaction[];
    categories: Category[];
    onAssign: (transactionId: number, categoryId: number | null) => void;
  } = $props();

  function categoryName(id: number | null): string {
    if (id == null) return '';
    return categories.find((c) => c.id === id)?.name ?? '?';
  }
</script>

{#if transactions.length === 0}
  <div class="text-center py-16 text-gray-500">
    {i18n.t('apps.budget.table.empty')}
    <a href="/apps/budget/import" class="text-blue-600 font-semibold hover:underline ml-1">{i18n.t('apps.budget.table.emptyCta')}</a>
  </div>
{:else}
  <div class="overflow-auto max-h-[calc(100vh-16rem)] bg-white rounded-xl border border-gray-200">
    <table class="w-full text-sm text-left">
      <thead class="sticky top-0 bg-gray-50 shadow-[inset_0_-1px_0_0_rgb(229,231,235)] z-10">
        <tr>
          <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.table.date')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.table.description')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.table.merchant')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600 text-right">{i18n.t('apps.budget.table.amount')}</th>
          <th class="px-4 py-3 font-semibold text-gray-600">{i18n.t('apps.budget.table.category')}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        {#each transactions as t (t.id)}
          <tr class="hover:bg-gray-50 transition-colors {t.categoryId == null ? 'bg-amber-50/30' : ''}">
            <td class="px-4 py-3 whitespace-nowrap text-gray-700">{t.date}</td>
            <td class="px-4 py-3 text-gray-800 max-w-xs truncate" title={t.description}>
              {t.description}
            </td>
            <td class="px-4 py-3 text-gray-500 text-xs">{t.merchant ?? ''}</td>
            <td class="px-4 py-3 text-right font-semibold whitespace-nowrap {t.amountCents < 0 ? 'text-gray-900' : 'text-emerald-600'}">
              {formatCents(t.amountCents)} {t.currency}
            </td>
            <td class="px-4 py-3">
              <select
                class="block w-full text-sm rounded-md border border-gray-300 bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                value={t.categoryId ?? ''}
                onchange={(e) => {
                  const v = (e.currentTarget as HTMLSelectElement).value;
                  onAssign(t.id, v === '' ? null : Number(v));
                }}
                aria-label="Category for {t.description}"
              >
                <option value="">{i18n.t('apps.budget.table.uncategorized')}</option>
                {#each categories as c}
                  <option value={c.id}>{c.name}</option>
                {/each}
              </select>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
