<script lang="ts">
  import { app } from '$lib/apps/budget/state/app.svelte';
  import EnvelopeCard from '$lib/apps/budget/components/dashboard/EnvelopeCard.svelte';
  import {
    isoWeek,
    PERIOD_BUDGET_FACTOR,
    periodRange,
    shiftPeriod,
    type Period
  } from '$lib/apps/budget/utils/date';
  import { formatCents } from '$lib/apps/budget/utils/money';
  import { i18n } from '$lib/stores/language.svelte.js';
  import { CalendarClock, ChevronLeft, ChevronRight } from 'lucide-svelte';

  let period = $state<Period>('month');
  let anchor = $state<Date>(new Date());

  let range = $derived(periodRange(period, anchor));

  let periodLabel = $derived.by(() => {
    const locale = i18n.current;
    if (period === 'month') {
      return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
        month: 'long',
        year: 'numeric'
      }).format(anchor);
    }
    if (period === 'year') {
      return String(anchor.getFullYear());
    }
    return i18n.t('apps.budget.dashboard.weekLabel', {
      week: isoWeek(anchor),
      year: anchor.getFullYear()
    });
  });

  let expenseCategories = $derived(
    app.workspace.categories.filter((c) => c.kind === 'expense' || c.kind === 'savings')
  );

  let inRange = $derived.by(() => {
    return app.workspace.transactions.filter(
      (t) => t.date >= range.startIso && t.date <= range.endIso
    );
  });

  let spendByCategory = $derived.by(() => {
    const out = new Map<number, number>();
    for (const t of inRange) {
      if (t.categoryId == null) continue;
      if (t.amountCents >= 0) continue;
      out.set(t.categoryId, (out.get(t.categoryId) ?? 0) + Math.abs(t.amountCents));
    }
    return out;
  });

  let countByCategory = $derived.by(() => {
    const out = new Map<number, number>();
    for (const t of inRange) {
      if (t.categoryId == null) continue;
      if (t.amountCents >= 0) continue;
      out.set(t.categoryId, (out.get(t.categoryId) ?? 0) + 1);
    }
    return out;
  });

  let income = $derived(
    inRange.filter((t) => t.amountCents > 0).reduce((s, t) => s + t.amountCents, 0)
  );
  let spent = $derived(
    inRange.filter((t) => t.amountCents < 0).reduce((s, t) => s + Math.abs(t.amountCents), 0)
  );
  let uncategorizedCount = $derived(app.workspace.transactions.filter((t) => t.categoryId == null).length);

  let factor = $derived(PERIOD_BUDGET_FACTOR[period]);
  function scaleTarget(monthly: number | null): number | null {
    if (monthly == null) return null;
    return Math.round(monthly * factor);
  }

  function go(delta: number) {
    anchor = shiftPeriod(period, anchor, delta);
  }

  function today() {
    anchor = new Date();
  }
</script>

<svelte:head>
  <title>{i18n.t('common.budget')} — {i18n.t('apps.budget.nav.dashboard')} | SYAM</title>
</svelte:head>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div class="inline-flex rounded-lg border border-gray-200 bg-white overflow-hidden w-fit">
      {#each [
        { id: 'week', label: i18n.t('apps.budget.dashboard.week') },
        { id: 'month', label: i18n.t('apps.budget.dashboard.month') },
        { id: 'year', label: i18n.t('apps.budget.dashboard.year') }
      ] as opt}
        <button
          type="button"
          onclick={() => (period = opt.id as Period)}
          class="px-4 py-2 text-sm font-semibold transition-colors cursor-pointer {period === opt.id ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}"
        >
          {opt.label}
        </button>
      {/each}
    </div>

    <div class="inline-flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-1 py-1">
      <button
        type="button"
        onclick={() => go(-1)}
        class="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
        aria-label={i18n.t('apps.budget.dashboard.previous')}
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onclick={today}
        class="px-3 py-1 text-sm font-semibold text-gray-800 capitalize cursor-pointer hover:bg-gray-50 rounded-md min-w-[140px]"
        title={i18n.t('apps.budget.dashboard.today')}
      >
        {periodLabel}
      </button>
      <button
        type="button"
        onclick={() => go(1)}
        class="p-1.5 rounded-md text-gray-600 hover:bg-gray-100 cursor-pointer"
        aria-label={i18n.t('apps.budget.dashboard.next')}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
    <div class="bg-white rounded-xl p-5 border border-gray-200">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{i18n.t('apps.budget.dashboard.income')}</div>
      <div class="mt-1 text-2xl font-extrabold text-emerald-600">{formatCents(income)}</div>
    </div>
    <div class="bg-white rounded-xl p-5 border border-gray-200">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{i18n.t('apps.budget.dashboard.spent')}</div>
      <div class="mt-1 text-2xl font-extrabold text-gray-900">{formatCents(spent)}</div>
    </div>
    <div class="bg-white rounded-xl p-5 border border-gray-200">
      <div class="text-xs font-semibold text-gray-500 uppercase tracking-wider">{i18n.t('apps.budget.dashboard.net')}</div>
      <div class="mt-1 text-2xl font-extrabold {income - spent >= 0 ? 'text-emerald-600' : 'text-red-600'}">
        {formatCents(income - spent)}
      </div>
    </div>
  </div>

  {#if uncategorizedCount > 0}
    <a
      href="/apps/budget/transactions"
      class="mb-6 flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
    >
      <CalendarClock size={20} class="text-amber-600" />
      <span class="text-sm text-amber-800">
        {i18n.t('apps.budget.dashboard.uncategorizedHint', { count: uncategorizedCount })}
      </span>
    </a>
  {/if}

  <h2 class="text-xl font-bold text-gray-900 mb-4">{i18n.t('apps.budget.dashboard.envelopes')}</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each expenseCategories as c (c.id)}
      <EnvelopeCard
        category={c}
        spentCents={spendByCategory.get(c.id) ?? 0}
        count={countByCategory.get(c.id) ?? 0}
        targetCents={scaleTarget(c.monthlyBudgetCents)}
      />
    {/each}
  </div>
</div>
