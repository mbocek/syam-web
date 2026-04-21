<script lang="ts">
  import { app } from '$lib/apps/budget/state/app.svelte';
  import { detectParser } from '$lib/apps/budget/banks/detect';
  import { decodeBytes } from '$lib/apps/budget/banks/parser';
  import type { ParsedTransaction } from '$lib/apps/budget/types';
  import { FileUp, AlertTriangle, CheckCircle2 } from 'lucide-svelte';
  import { formatCents } from '$lib/apps/budget/utils/money';
  import { i18n } from '$lib/stores/language.svelte.js';

  let fileName = $state<string | null>(null);
  let parserLabel = $state<string | null>(null);
  let preview = $state<ParsedTransaction[]>([]);
  let error = $state<string | null>(null);
  let imported = $state<number | null>(null);

  async function onFileChange(event: Event) {
    const input = event.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    reset();
    fileName = file.name;

    try {
      const bytes = await file.arrayBuffer();
      const text = decodeBytes(bytes);
      const parser = detectParser(text, file.name);
      if (!parser) {
        error = i18n.t('apps.budget.import.noParser');
        return;
      }
      parserLabel = parser.label;
      preview = parser.parse(text);
      if (preview.length === 0) error = i18n.t('apps.budget.import.emptyParse');
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    }
  }

  function commit() {
    if (preview.length === 0) return;
    imported = app.importTransactions(preview);
    preview = [];
  }

  function reset() {
    fileName = null;
    parserLabel = null;
    preview = [];
    error = null;
    imported = null;
  }
</script>

<svelte:head>
  <title>{i18n.t('common.budget')} — {i18n.t('apps.budget.nav.import')} | SYAM</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-8">
    <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">{i18n.t('apps.budget.import.title')}</h1>
    <p class="mt-2 text-gray-500">{i18n.t('apps.budget.import.subtitle')}</p>
  </div>

  <label class="block mb-6">
    <div class="flex items-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-300 bg-white hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
      <FileUp size={24} class="text-blue-600" />
      <div>
        <div class="font-semibold text-gray-900">{i18n.t('apps.budget.import.pickTitle')}</div>
        <div class="text-sm text-gray-500">
          {fileName ?? i18n.t('apps.budget.import.pickHint')}
        </div>
      </div>
    </div>
    <input type="file" accept=".csv,text/csv" onchange={onFileChange} class="sr-only" />
  </label>

  {#if error}
    <div class="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
      <AlertTriangle size={18} class="text-red-600 shrink-0 mt-0.5" />
      <div class="text-sm text-red-700">{error}</div>
    </div>
  {/if}

  {#if imported != null}
    <div class="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
      <CheckCircle2 size={18} class="text-emerald-600" />
      <div class="text-sm text-emerald-800">
        {i18n.t('apps.budget.import.imported', { count: imported })}
        <a href="/apps/budget/transactions" class="font-semibold underline ml-1">{i18n.t('apps.budget.import.reviewThem')}</a>
      </div>
    </div>
  {/if}

  {#if preview.length > 0}
    <div class="mb-4 flex items-center justify-between">
      <div>
        <div class="text-sm text-gray-500">{i18n.t('apps.budget.import.parsedBy', { parser: parserLabel ?? '' })}</div>
        <div class="text-lg font-bold text-gray-900">{i18n.t('apps.budget.import.readyCount', { count: preview.length })}</div>
      </div>
      <button
        type="button"
        onclick={commit}
        class="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
      >
        {i18n.t('apps.budget.import.importAll')}
      </button>
    </div>

    <div class="overflow-x-auto bg-white rounded-xl border border-gray-200">
      <table class="w-full text-sm text-left">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr>
            <th class="px-4 py-2 font-semibold text-gray-600">{i18n.t('apps.budget.table.date')}</th>
            <th class="px-4 py-2 font-semibold text-gray-600">{i18n.t('apps.budget.table.description')}</th>
            <th class="px-4 py-2 font-semibold text-gray-600">{i18n.t('apps.budget.table.merchant')}</th>
            <th class="px-4 py-2 font-semibold text-gray-600 text-right">{i18n.t('apps.budget.table.amount')}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          {#each preview.slice(0, 20) as t}
            <tr>
              <td class="px-4 py-2 text-gray-700 whitespace-nowrap">{t.date}</td>
              <td class="px-4 py-2 text-gray-800 max-w-sm truncate">{t.description}</td>
              <td class="px-4 py-2 text-gray-500 text-xs">{t.merchant ?? ''}</td>
              <td class="px-4 py-2 text-right whitespace-nowrap {t.amountCents < 0 ? 'text-gray-900' : 'text-emerald-600'}">
                {formatCents(t.amountCents)} {t.currency}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
      {#if preview.length > 20}
        <div class="px-4 py-2 text-xs text-gray-400 bg-gray-50 border-t border-gray-200">
          {i18n.t('apps.budget.import.showingFirst', { total: preview.length })}
        </div>
      {/if}
    </div>
  {/if}
</div>
