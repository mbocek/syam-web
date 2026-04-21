<script>
  import Card from '../components/ui/Card.svelte';
  import NumberInput from '../components/ui/NumberInput.svelte';
  import StatCard from '../components/ui/StatCard.svelte';
  import { PiggyBank, TrendingUp, Calendar, ChartArea } from 'lucide-svelte';
  import { i18n } from '../stores/language.svelte.js';
  import { calculateCompoundInterestWithVariance } from '../utils/calculators.js';
  import { lineChartOptions, renderLineChart } from '../utils/chart.js';

  let chartCanvas = $state();
  let chart = null;

  let principal = $state(1000);
  let rate = $state(5);
  let variance = $state(2);
  let years = $state(10);
  let frequency = $state(1);
  let monthlyContribution = $state(0);

  let result = $derived(
    calculateCompoundInterestWithVariance({ principal, rate, variance, years, monthlyContribution, frequency })
  );

  $effect(() => {
    if (!chartCanvas || result.base.breakdown.length === 0) return;

    const labels = result.base.breakdown.map((d) => `${i18n.t('calculator.year')} ${d.year}`);

    const datasets = [
      {
        label: `${i18n.t('calculator.balance')} (${i18n.currency})`,
        data: result.base.breakdown.map((d) => d.balance),
        fill: false,
        borderColor: 'rgb(37, 99, 235)',
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 5
      }
    ];

    if (variance > 0) {
      datasets.push({
        label: `${i18n.t('calculator.balance')} (High) (${i18n.currency})`,
        data: result.high.breakdown.map((d) => d.balance),
        fill: '+1',
        backgroundColor: 'rgba(37, 99, 235, 0.05)',
        borderColor: 'rgba(37, 99, 235, 0.2)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0
      });
      datasets.push({
        label: `${i18n.t('calculator.balance')} (Low) (${i18n.currency})`,
        data: result.low.breakdown.map((d) => d.balance),
        fill: false,
        borderColor: 'rgba(37, 99, 235, 0.2)',
        borderDash: [5, 5],
        tension: 0.4,
        pointRadius: 0
      });
    }

    chart = renderLineChart({
      canvas: chartCanvas,
      chart,
      datasets,
      labels,
      options: lineChartOptions(() => i18n.currency)
    });
  });
</script>

<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
      {i18n.t('calculator.title')}
    </h1>
    <p class="mt-4 text-lg text-gray-500">
      {i18n.t('calculator.description')}
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card title={i18n.t('calculator.parameters')}>
      <div class="flex flex-col gap-5">
        <NumberInput id="principal" label={i18n.t('calculator.principal')} bind:value={principal} icon={PiggyBank} iconClass="text-blue-500" suffix={i18n.currency} />
        <NumberInput id="monthlyContribution" label={i18n.t('calculator.monthlyContribution')} bind:value={monthlyContribution} icon={TrendingUp} iconClass="text-emerald-500" suffix={i18n.currency} />
        <NumberInput id="rate" label={i18n.t('calculator.rate')} bind:value={rate} icon={TrendingUp} iconClass="text-amber-500 rotate-45" suffix="%" step="0.1" />
        <NumberInput id="variance" label={i18n.t('calculator.variance')} bind:value={variance} icon={ChartArea} iconClass="text-amber-400" suffix="%" step="0.1" min="0" />

        <div class="flex flex-col gap-1.5">
          <label for="frequency" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} class="text-blue-400" />
            {i18n.t('calculator.frequency')}
          </label>
          <select
            id="frequency"
            bind:value={frequency}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
          >
            <option value={1}>{i18n.t('calculator.frequencyOptions.annually')}</option>
            <option value={2}>{i18n.t('calculator.frequencyOptions.semiAnnually')}</option>
            <option value={4}>{i18n.t('calculator.frequencyOptions.quarterly')}</option>
            <option value={12}>{i18n.t('calculator.frequencyOptions.monthly')}</option>
          </select>
        </div>

        <NumberInput id="years" label={i18n.t('calculator.years')} bind:value={years} icon={Calendar} iconClass="text-violet-500" />
      </div>
    </Card>

    <div class="lg:col-span-2 flex flex-col gap-6">
      <Card title={i18n.t('calculator.growthProjection')}>
        <div class="h-[300px] w-full">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </Card>

      <StatCard
        size="lg"
        label={i18n.t('calculator.estimatedValue')}
        value="{i18n.formatNumber(result.base.total)} {i18n.currency}"
      >
        {#if variance > 0}
          <div class="mt-2 text-blue-400 font-medium">
            {i18n.t('calculator.range')}: {i18n.formatNumber(result.low.total)} - {i18n.formatNumber(result.high.total)} {i18n.currency}
          </div>
        {/if}
        <div class="mt-4 text-gray-500 text-sm text-center px-6">
          {i18n.t('calculator.basis', { rate, years })}
        </div>
      </StatCard>

      <Card title={i18n.t('calculator.breakdown')} collapsible={true} isOpen={false}>
        <div class="overflow-x-auto -mx-6">
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
              {#each result.mergedBreakdown as row}
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
                    {#if variance > 0}
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
                    {#if variance > 0}
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
        </div>
      </Card>
    </div>
  </div>
</div>
