<script>
  import Card from '../components/ui/Card.svelte';
  import NumberInput from '../components/ui/NumberInput.svelte';
  import StatCard from '../components/ui/StatCard.svelte';
  import { PiggyBank, TrendingUp, Calendar, ChartArea, Plus, X } from 'lucide-svelte';
  import { i18n } from '../stores/language.svelte.js';
  import { calculateCompoundInterestWithVariance } from '../utils/calculators.js';
  import { lineChartOptions, renderLineChart } from '../utils/chart.js';

  let chartCanvas = $state();
  let chart = null;

  const defaults = () => ({
    principal: 1000,
    rate: 5,
    variance: 2,
    years: 10,
    frequency: 1,
    monthlyContribution: 0
  });

  let a = $state(defaults());
  let b = $state(defaults());
  let compareMode = $state(false);

  function enableCompare() {
    b = { ...$state.snapshot(a), rate: a.rate + 1 };
    compareMode = true;
  }

  let resultA = $derived(calculateCompoundInterestWithVariance(a));
  let resultB = $derived(compareMode ? calculateCompoundInterestWithVariance(b) : null);
  let deltaTotal = $derived(compareMode ? resultB.base.total - resultA.base.total : 0);
  let showVariance = $derived(!compareMode && a.variance > 0);

  // Pair up A + B breakdowns for the comparison table.
  let pairedBreakdown = $derived(
    compareMode
      ? resultA.base.breakdown.map((row, i) => ({
          year: row.year,
          balanceA: row.balance,
          balanceB: resultB.base.breakdown[i]?.balance ?? row.balance,
          delta: (resultB.base.breakdown[i]?.balance ?? row.balance) - row.balance
        }))
      : []
  );

  $effect(() => {
    if (!chartCanvas || resultA.base.breakdown.length === 0) return;

    const labels = resultA.base.breakdown.map((d) => `${i18n.t('calculator.year')} ${d.year}`);
    const datasets = [];

    if (compareMode) {
      datasets.push({
        label: `${i18n.t('calculator.compare.scenarioA')} (${i18n.currency})`,
        data: resultA.base.breakdown.map((d) => d.balance),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5
      });
      datasets.push({
        label: `${i18n.t('calculator.compare.scenarioB')} (${i18n.currency})`,
        data: resultB.base.breakdown.map((d) => d.balance),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5
      });
    } else {
      datasets.push({
        label: `${i18n.t('calculator.balance')} (${i18n.currency})`,
        data: resultA.base.breakdown.map((d) => d.balance),
        borderColor: 'rgb(37, 99, 235)',
        fill: false,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5
      });

      if (showVariance) {
        datasets.push({
          label: `${i18n.t('calculator.balance')} (High) (${i18n.currency})`,
          data: resultA.high.breakdown.map((d) => d.balance),
          fill: '+1',
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          borderColor: 'rgba(37, 99, 235, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0
        });
        datasets.push({
          label: `${i18n.t('calculator.balance')} (Low) (${i18n.currency})`,
          data: resultA.low.breakdown.map((d) => d.balance),
          fill: false,
          borderColor: 'rgba(37, 99, 235, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0
        });
      }
    }

    chart = renderLineChart({
      canvas: chartCanvas,
      chart,
      datasets,
      labels,
      options: lineChartOptions(() => i18n.currency)
    });
  });

  let deltaWinner = $derived(deltaTotal > 0 ? 'B' : deltaTotal < 0 ? 'A' : 'tie');
  let deltaAbs = $derived(Math.abs(deltaTotal));
</script>

<div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
    <div>
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        {i18n.t('calculator.title')}
      </h1>
      <p class="mt-4 text-lg text-gray-500">
        {i18n.t('calculator.description')}
      </p>
    </div>

    {#if !compareMode}
      <button
        type="button"
        onclick={enableCompare}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors shrink-0"
      >
        <Plus size={16} />
        {i18n.t('calculator.compare.enable')}
      </button>
    {:else}
      <button
        type="button"
        onclick={() => (compareMode = false)}
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-600 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
      >
        <X size={16} />
        {i18n.t('calculator.compare.disable')}
      </button>
    {/if}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="flex flex-col gap-6">
      <div class="relative">
        {#if compareMode}
          <div class="absolute -top-3 left-4 px-2 bg-surface-primary text-xs font-bold uppercase tracking-wider text-blue-600 z-10">
            {i18n.t('calculator.compare.scenarioA')}
          </div>
          <div class="rounded-card border-2 border-blue-500/30">
            <div class="mb-0">
              <Card title={i18n.t('calculator.parameters')}>
                {@render paramFields(a, 'a')}
              </Card>
            </div>
          </div>
        {:else}
          <Card title={i18n.t('calculator.parameters')}>
            {@render paramFields(a, 'a')}
          </Card>
        {/if}
      </div>

      {#if compareMode}
        <div class="relative">
          <div class="absolute -top-3 left-4 px-2 bg-surface-primary text-xs font-bold uppercase tracking-wider text-emerald-600 z-10">
            {i18n.t('calculator.compare.scenarioB')}
          </div>
          <div class="rounded-card border-2 border-emerald-500/30">
            <Card title={i18n.t('calculator.parameters')}>
              {@render paramFields(b, 'b')}
            </Card>
          </div>
        </div>
      {/if}
    </div>

    <div class="lg:col-span-2 flex flex-col gap-6">
      <Card title={i18n.t('calculator.growthProjection')}>
        <div class="h-[300px] w-full">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </Card>

      {#if compareMode}
        <Card>
          <div class="flex flex-col items-center justify-center py-8 rounded-xl bg-linear-to-br {deltaWinner === 'B' ? 'from-emerald-50 to-teal-50' : deltaWinner === 'A' ? 'from-blue-50 to-indigo-50' : 'from-gray-50 to-gray-100'}">
            <div class="{deltaWinner === 'B' ? 'text-emerald-600/60' : deltaWinner === 'A' ? 'text-blue-600/60' : 'text-gray-600/60'} text-sm font-semibold uppercase tracking-wider mb-2">
              {i18n.t('calculator.compare.difference')}
            </div>
            <div class="text-5xl font-extrabold {deltaWinner === 'B' ? 'text-emerald-600' : deltaWinner === 'A' ? 'text-blue-600' : 'text-gray-600'} tracking-tight">
              {deltaWinner === 'A' ? '−' : deltaWinner === 'B' ? '+' : ''}{i18n.formatNumber(deltaAbs)} {i18n.currency}
            </div>
            <div class="mt-3 text-gray-600 text-sm text-center px-6">
              {#if deltaWinner === 'tie'}
                {i18n.t('calculator.compare.tied')}
              {:else if deltaWinner === 'B'}
                {i18n.t('calculator.compare.scenarioBWins', { delta: i18n.formatNumber(deltaAbs), currency: i18n.currency })}
              {:else}
                {i18n.t('calculator.compare.scenarioAWins', { delta: i18n.formatNumber(deltaAbs), currency: i18n.currency })}
              {/if}
            </div>
          </div>
        </Card>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard tone="blue" label={i18n.t('calculator.compare.scenarioA')} value="{i18n.formatNumber(resultA.base.total)} {i18n.currency}" />
          <StatCard tone="emerald" label={i18n.t('calculator.compare.scenarioB')} value="{i18n.formatNumber(resultB.base.total)} {i18n.currency}" />
        </div>
      {:else}
        <StatCard
          size="lg"
          label={i18n.t('calculator.estimatedValue')}
          value="{i18n.formatNumber(resultA.base.total)} {i18n.currency}"
        >
          {#if showVariance}
            <div class="mt-2 text-blue-400 font-medium">
              {i18n.t('calculator.range')}: {i18n.formatNumber(resultA.low.total)} - {i18n.formatNumber(resultA.high.total)} {i18n.currency}
            </div>
          {/if}
          <div class="mt-4 text-gray-500 text-sm text-center px-6">
            {i18n.t('calculator.basis', { rate: a.rate, years: a.years })}
          </div>
        </StatCard>
      {/if}

      <Card title={i18n.t('calculator.breakdown')} collapsible={true} isOpen={false}>
        <div class="overflow-x-auto -mx-6">
          {#if compareMode}
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="pl-6 pr-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400">{i18n.t('calculator.year')}</th>
                  <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.compare.balanceA')}</th>
                  <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.compare.balanceB')}</th>
                  <th class="pl-4 pr-6 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.compare.delta')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {#each pairedBreakdown as row}
                  <tr class="hover:bg-blue-50/30 transition-colors group">
                    <td class="pl-6 pr-4 py-4">
                      <div class="flex items-center gap-2">
                        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {row.year}
                        </span>
                        <span class="text-sm font-semibold text-gray-900">{i18n.t('calculator.year')} {row.year}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-right whitespace-nowrap">
                      <span class="text-sm font-bold text-blue-600">{i18n.formatNumber(row.balanceA)}</span> <span class="text-blue-500/60 text-xs">{i18n.currency}</span>
                    </td>
                    <td class="px-4 py-4 text-right whitespace-nowrap">
                      <span class="text-sm font-bold text-emerald-600">{i18n.formatNumber(row.balanceB)}</span> <span class="text-emerald-500/60 text-xs">{i18n.currency}</span>
                    </td>
                    <td class="pl-4 pr-6 py-4 text-right whitespace-nowrap">
                      <span class="text-sm font-black {row.delta > 0 ? 'text-emerald-600' : row.delta < 0 ? 'text-red-600' : 'text-gray-500'}">
                        {row.delta > 0 ? '+' : ''}{i18n.formatNumber(row.delta)}
                      </span>
                      <span class="text-gray-400 text-xs">{i18n.currency}</span>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {:else}
            <table class="w-full border-collapse text-left">
              <thead>
                <tr class="bg-gray-50/50">
                  <th class="pl-6 pr-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400">{i18n.t('calculator.year')}</th>
                  <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.contributions')}</th>
                  <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.interest')}</th>
                  <th class="pl-4 pr-6 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.balance')}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                {#each resultA.mergedBreakdown as row}
                  <tr class="hover:bg-blue-50/30 transition-colors group">
                    <td class="pl-6 pr-4 py-4">
                      <div class="flex items-center gap-2">
                        <span class="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {row.year}
                        </span>
                        <span class="text-sm font-semibold text-gray-900">{i18n.t('calculator.year')} {row.year}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-sm text-gray-600 text-right whitespace-nowrap">
                      <span class="font-medium text-gray-900">{i18n.formatNumber(row.totalContributions)}</span> <span class="text-gray-400 text-xs">{i18n.currency}</span>
                    </td>
                    <td class="px-4 py-4 text-right whitespace-nowrap">
                      <div class="text-sm font-bold text-emerald-600">
                        +{i18n.formatNumber(row.totalInterest)} <span class="text-emerald-500/60 text-xs font-normal">{i18n.currency}</span>
                      </div>
                      {#if showVariance}
                        <div class="mt-1 flex items-center justify-end gap-1.5 text-[10px] font-medium text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 inline-flex ml-auto group-hover:bg-white transition-colors">
                          <span class="text-emerald-600/50">{i18n.formatNumber(row.lowInterest)}</span>
                          <span class="w-1 h-px bg-gray-200"></span>
                          <span class="text-emerald-600/50">{i18n.formatNumber(row.highInterest)}</span>
                        </div>
                      {/if}
                    </td>
                    <td class="pl-4 pr-6 py-4 text-right whitespace-nowrap">
                      <div class="text-sm font-black text-blue-600">
                        {i18n.formatNumber(row.balance)} <span class="text-blue-500/60 text-xs font-normal">{i18n.currency}</span>
                      </div>
                      {#if showVariance}
                        <div class="mt-1 flex items-center justify-end gap-1.5 text-[10px] font-medium text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 inline-flex ml-auto group-hover:bg-white transition-colors">
                          <span class="text-blue-600/50">{i18n.formatNumber(row.lowBalance)}</span>
                          <span class="w-1 h-px bg-gray-200"></span>
                          <span class="text-blue-600/50">{i18n.formatNumber(row.highBalance)}</span>
                        </div>
                      {/if}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          {/if}
        </div>
      </Card>
    </div>
  </div>
</div>

{#snippet paramFields(p, prefix)}
  <div class="flex flex-col gap-5">
    <NumberInput id="{prefix}-principal" label={i18n.t('calculator.principal')} bind:value={p.principal} icon={PiggyBank} iconClass="text-blue-500" suffix={i18n.currency} />
    <NumberInput id="{prefix}-monthlyContribution" label={i18n.t('calculator.monthlyContribution')} bind:value={p.monthlyContribution} icon={TrendingUp} iconClass="text-emerald-500" suffix={i18n.currency} />
    <NumberInput id="{prefix}-rate" label={i18n.t('calculator.rate')} bind:value={p.rate} icon={TrendingUp} iconClass="text-amber-500 rotate-45" suffix="%" step="0.1" />
    <NumberInput id="{prefix}-variance" label={i18n.t('calculator.variance')} bind:value={p.variance} icon={ChartArea} iconClass="text-amber-400" suffix="%" step="0.1" min="0" />

    <div class="flex flex-col gap-1.5">
      <label for="{prefix}-frequency" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <TrendingUp size={16} class="text-blue-400" />
        {i18n.t('calculator.frequency')}
      </label>
      <select
        id="{prefix}-frequency"
        bind:value={p.frequency}
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
      >
        <option value={1}>{i18n.t('calculator.frequencyOptions.annually')}</option>
        <option value={2}>{i18n.t('calculator.frequencyOptions.semiAnnually')}</option>
        <option value={4}>{i18n.t('calculator.frequencyOptions.quarterly')}</option>
        <option value={12}>{i18n.t('calculator.frequencyOptions.monthly')}</option>
      </select>
    </div>

    <NumberInput id="{prefix}-years" label={i18n.t('calculator.years')} bind:value={p.years} icon={Calendar} iconClass="text-violet-500" />
  </div>
{/snippet}
