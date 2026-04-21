<script>
  import Card from '../components/ui/Card.svelte';
  import NumberInput from '../components/ui/NumberInput.svelte';
  import StatCard from '../components/ui/StatCard.svelte';
  import { TrendingDown, Calendar, Wallet } from 'lucide-svelte';
  import { i18n } from '../stores/language.svelte.js';
  import { calculateMortgageSchedule } from '../utils/calculators.js';
  import { lineChartOptions, renderLineChart } from '../utils/chart.js';

  let chartCanvas = $state();
  let chart = null;

  let amount = $state(1000000);
  let rate = $state(4.5);
  let years = $state(30);

  let schedule = $derived(calculateMortgageSchedule({ amount, rate, years }));

  $effect(() => {
    if (!chartCanvas || schedule.breakdown.length === 0) return;

    chart = renderLineChart({
      canvas: chartCanvas,
      chart,
      labels: schedule.breakdown.map((d) => `${i18n.t('calculator.year')} ${d.year}`),
      datasets: [
        {
          label: `${i18n.t('mortgage.balance')} (${i18n.currency})`,
          data: schedule.breakdown.map((d) => d.balance),
          fill: true,
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderColor: 'rgb(37, 99, 235)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5
        }
      ],
      options: lineChartOptions(() => i18n.currency, { beginAtZero: true })
    });
  });
</script>

<div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
  <div class="mb-12">
    <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
      {i18n.t('mortgage.title')}
    </h1>
    <p class="mt-4 text-lg text-gray-500">
      {i18n.t('mortgage.description')}
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card title={i18n.t('mortgage.parameters')}>
      <div class="flex flex-col gap-5">
        <NumberInput id="amount" label={i18n.t('mortgage.amount')} bind:value={amount} icon={Wallet} iconClass="text-blue-500" suffix={i18n.currency} />
        <NumberInput id="rate" label={i18n.t('mortgage.rate')} bind:value={rate} icon={TrendingDown} iconClass="text-amber-500" suffix="%" step="0.1" />
        <NumberInput id="years" label={i18n.t('mortgage.years')} bind:value={years} icon={Calendar} iconClass="text-violet-500" />
      </div>
    </Card>

    <div class="lg:col-span-2 flex flex-col gap-6">
      <Card title={i18n.t('calculator.growthProjection')}>
        <div class="h-[300px] w-full">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </Card>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard tone="blue" label={i18n.t('mortgage.monthlyPayment')} value="{i18n.formatNumber(schedule.monthlyPayment)} {i18n.currency}" />
        <StatCard tone="emerald" label={i18n.t('mortgage.totalRepayment')} value="{i18n.formatNumber(schedule.totalRepayment)} {i18n.currency}" />
      </div>

      <Card title={i18n.t('mortgage.amortizationSchedule')} collapsible={true} isOpen={false}>
        <div class="overflow-x-auto -mx-6">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="pl-6 pr-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400">{i18n.t('calculator.year')}</th>
                <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('mortgage.principal')}</th>
                <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('mortgage.interest')}</th>
                <th class="pl-4 pr-6 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('mortgage.balance')}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {#each schedule.breakdown as row}
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
                    <span class="font-medium text-gray-900">{i18n.formatNumber(row.principal)}</span> <span class="text-gray-400 text-xs">{i18n.currency}</span>
                  </td>
                  <td class="px-4 py-4 text-right whitespace-nowrap">
                    <div class="text-sm font-bold text-amber-600">
                      {i18n.formatNumber(row.interest)} <span class="text-amber-500/60 text-xs font-normal">{i18n.currency}</span>
                    </div>
                  </td>
                  <td class="pl-4 pr-6 py-4 text-right whitespace-nowrap">
                    <div class="text-sm font-black text-blue-600">
                      {i18n.formatNumber(row.balance)} <span class="text-blue-500/60 text-xs font-normal">{i18n.currency}</span>
                    </div>
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
