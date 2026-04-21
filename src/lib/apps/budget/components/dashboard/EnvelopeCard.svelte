<script lang="ts">
  import type { Category } from '$lib/apps/budget/types';
  import { formatCents } from '$lib/apps/budget/utils/money';
  import { i18n } from '$lib/stores/language.svelte.js';

  let {
    category,
    spentCents,
    count = 0,
    targetCents = null
  }: {
    category: Category;
    spentCents: number;
    count?: number;
    targetCents?: number | null;
  } = $props();

  let target = $derived(targetCents ?? 0);
  let hasTarget = $derived(targetCents != null && targetCents > 0);
  let pct = $derived(hasTarget ? Math.min(100, (spentCents / target) * 100) : 0);
  let overBudget = $derived(hasTarget && spentCents > target);

  let toneClasses = $derived.by(() => {
    if (!hasTarget) return 'bg-gray-100 text-gray-600';
    if (overBudget) return 'bg-red-500';
    if (pct > 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  });
</script>

<div class="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
  <div class="flex items-start justify-between mb-3">
    <div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 uppercase tracking-wide font-semibold">{category.name}</span>
        {#if count > 0}
          <span class="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
            {count}
          </span>
        {/if}
      </div>
      <div class="mt-1 text-2xl font-extrabold text-gray-900">
        {formatCents(spentCents)}
      </div>
    </div>
    {#if hasTarget}
      <div class="text-right">
        <div class="text-xs text-gray-400">{i18n.t('apps.budget.envelope.of')}</div>
        <div class="text-sm font-semibold text-gray-600">{formatCents(target)}</div>
      </div>
    {/if}
  </div>

  {#if hasTarget}
    <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        class="h-full transition-all duration-300 {toneClasses}"
        style="width: {pct}%"
      ></div>
    </div>
    {#if overBudget}
      <div class="mt-2 text-xs font-semibold text-red-600">
        {i18n.t('apps.budget.envelope.over', { amount: formatCents(spentCents - target) })}
      </div>
    {:else}
      <div class="mt-2 text-xs text-gray-500">
        {i18n.t('apps.budget.envelope.left', { amount: formatCents(target - spentCents) })}
      </div>
    {/if}
  {:else}
    <div class="mt-2 text-xs text-gray-400">{i18n.t('apps.budget.envelope.noTarget')}</div>
  {/if}
</div>
