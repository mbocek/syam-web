<script>
  import Card from '../components/ui/Card.svelte';
  import { PiggyBank, TrendingUp, Calendar, ChartArea } from 'lucide-svelte';
  import { i18n } from '../stores/language.svelte.js';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  let chartCanvas = $state();
  let chart = null;

  let principal = $state(1000);
  let rate = $state(5);
  let variance = $state(2);
  let years = $state(10);
  let frequency = $state(1); // Compounding frequency per year (12 = monthly, 1 = annually, etc.)
  let monthlyContribution = $state(0);

  function calculateForRate(r) {
    let total = principal;
    let data = [];
    const compoundingPeriodRate = (r / 100) / frequency;
    const totalMonths = years * 12;

    let currentYearInterest = 0;
    let currentYearContributions = 0;

    for (let month = 1; month <= totalMonths; month++) {
      total += monthlyContribution;
      currentYearContributions += monthlyContribution;
      
      const balanceBeforeInterest = total;
      if (month % (12 / frequency) === 0) {
        total *= (1 + compoundingPeriodRate);
      }
      currentYearInterest += (total - balanceBeforeInterest);

      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          totalContributions: currentYearContributions.toFixed(2),
          totalInterest: currentYearInterest.toFixed(2),
          balance: total.toFixed(2)
        });
        currentYearInterest = 0;
        currentYearContributions = 0;
      }
    }
    return {
      total: total.toFixed(2),
      breakdown: data
    };
  }

  let result = $derived.by(() => {
    const base = calculateForRate(rate);
    const low = calculateForRate(rate - variance);
    const high = calculateForRate(rate + variance);

    // Merge breakdown data
    const mergedBreakdown = base.breakdown.map((row, index) => {
      return {
        ...row,
        lowInterest: low.breakdown[index].totalInterest,
        highInterest: high.breakdown[index].totalInterest,
        lowBalance: low.breakdown[index].balance,
        highBalance: high.breakdown[index].balance
      };
    });

    return {
      base,
      low,
      high,
      mergedBreakdown
    };
  });

  $effect(() => {
    if (chartCanvas && result.base.breakdown.length > 0) {
      const ctx = chartCanvas.getContext('2d');
      const labels = result.base.breakdown.map(d => `${i18n.t('calculator.year')} ${d.year}`);
      
      const datasets = [
        {
          label: `${i18n.t('calculator.balance')} (${i18n.currency})`,
          data: result.base.breakdown.map(d => d.balance),
          fill: false,
          borderColor: 'rgb(37, 99, 235)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
          zIndex: 3
        }
      ];

      if (variance > 0) {
        datasets.push({
          label: `${i18n.t('calculator.balance')} (High) (${i18n.currency})`,
          data: result.high.breakdown.map(d => d.balance),
          fill: '+1',
          backgroundColor: 'rgba(37, 99, 235, 0.05)',
          borderColor: 'rgba(37, 99, 235, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          zIndex: 1
        });
        datasets.push({
          label: `${i18n.t('calculator.balance')} (Low) (${i18n.currency})`,
          data: result.low.breakdown.map(d => d.balance),
          fill: false,
          borderColor: 'rgba(37, 99, 235, 0.2)',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          zIndex: 2
        });
      }

      const chartData = {
        labels: labels,
        datasets: datasets
      };

      if (chart) {
        chart.data = chartData;
        chart.update();
      } else {
        chart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y} ${i18n.currency}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                grid: {
                  color: 'rgba(0, 0, 0, 0.05)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }
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
        <div class="flex flex-col gap-1.5">
          <label for="principal" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <PiggyBank size={16} class="text-blue-500" />
            {i18n.t('calculator.principal')}
          </label>
          <div class="relative">
            <input
              id="principal"
              type="number"
              bind:value={principal}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm font-medium">
              {i18n.currency}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="monthlyContribution" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} class="text-emerald-500" />
            {i18n.t('calculator.monthlyContribution')}
          </label>
          <div class="relative">
            <input
              id="monthlyContribution"
              type="number"
              bind:value={monthlyContribution}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm font-medium">
              {i18n.currency}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="rate" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} class="text-amber-500 rotate-45" />
            {i18n.t('calculator.rate')}
          </label>
          <div class="relative">
            <input
              id="rate"
              type="number"
              step="0.1"
              bind:value={rate}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              %
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="variance" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <ChartArea size={16} class="text-amber-400" />
            {i18n.t('calculator.variance')}
          </label>
          <div class="relative">
            <input
              id="variance"
              type="number"
              step="0.1"
              min="0"
              bind:value={variance}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              %
            </div>
          </div>
        </div>

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

        <div class="flex flex-col gap-1.5">
          <label for="years" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar size={16} class="text-violet-500" />
            {i18n.t('calculator.years')}
          </label>
          <input
            id="years"
            type="number"
            bind:value={years}
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    </Card>

    <div class="lg:col-span-2 flex flex-col gap-6">
      <Card title={i18n.t('calculator.growthProjection')}>
        <div class="h-[300px] w-full">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </Card>

      <Card>
        <div class="flex flex-col items-center justify-center py-10 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div class="text-blue-600/60 text-sm font-semibold uppercase tracking-wider mb-2">{i18n.t('calculator.estimatedValue')}</div>
          <div class="text-5xl font-extrabold text-blue-600 tracking-tight">{i18n.formatNumber(result.base.total)} {i18n.currency}</div>
          {#if variance > 0}
            <div class="mt-2 text-blue-400 font-medium">
              {i18n.t('calculator.range')}: {i18n.formatNumber(result.low.total)} - {i18n.formatNumber(result.high.total)} {i18n.currency}
            </div>
          {/if}
          <div class="mt-4 text-gray-500 text-sm text-center px-6">
            {i18n.t('calculator.basis', { rate, years })}
          </div>
        </div>
      </Card>

      <Card title={i18n.t('calculator.breakdown')} collapsible={true} isOpen={false}>
        <div class="overflow-x-auto -mx-6">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr class="bg-gray-50/50">
                <th class="pl-6 pr-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400">{i18n.t('calculator.year')}</th>
                <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">{i18n.t('calculator.contributions')}</th>
                <th class="px-4 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">
                  {i18n.t('calculator.interest')}
                </th>
                <th class="pl-4 pr-6 py-4 border-b border-gray-100 font-bold text-[11px] uppercase tracking-widest text-gray-400 text-right">
                  {i18n.t('calculator.balance')}
                </th>
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
