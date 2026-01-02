<script>
  import Card from '../components/ui/Card.svelte';
  import { PiggyBank, TrendingUp, Calendar, ChartArea } from 'lucide-svelte';
  import { language, currencies } from '../stores/language.js';
  import { onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  let currentCurrency = $state('€');
  let chartCanvas = $state();
  let chart = null;

  language.subscribe(lang => {
    currentCurrency = currencies[lang] || '€';
  });

  let principal = $state(1000);
  let rate = $state(5);
  let years = $state(10);
  let frequency = $state(1); // 1 for annual, 12 for monthly, etc.
  let monthlyContribution = $state(0);

  let result = $derived.by(() => {
    let total = principal;
    let data = [];
    const monthlyRate = (rate / 100) / 12;
    const totalMonths = years * 12;

    for (let month = 1; month <= totalMonths; month++) {
      total = total * (1 + monthlyRate) + monthlyContribution;
      if (month % 12 === 0) {
        data.push({
          year: month / 12,
          balance: total.toFixed(2)
        });
      }
    }
    return {
      total: total.toFixed(2),
      breakdown: data
    };
  });

  $effect(() => {
    if (chartCanvas && result.breakdown.length > 0) {
      const ctx = chartCanvas.getContext('2d');
      const data = {
        labels: result.breakdown.map(d => `Year ${d.year}`),
        datasets: [{
          label: `Balance (${currentCurrency})`,
          data: result.breakdown.map(d => d.balance),
          fill: true,
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderColor: 'rgb(37, 99, 235)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
        }]
      };

      if (chart) {
        chart.data = data;
        chart.update();
      } else {
        chart = new Chart(ctx, {
          type: 'line',
          data: data,
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
                    return `Balance: ${context.parsed.y} ${currentCurrency}`;
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

<div class="flex flex-col gap-6">
  <div class="flex flex-col gap-1">
    <h2 class="m-0 text-2xl font-bold text-gray-900">Compound Interest Calculator</h2>
    <p class="text-gray-500 text-sm">See how your investments grow over time with compound interest.</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card title="Parameters">
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="principal" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <PiggyBank size={16} class="text-blue-500" />
            Initial Deposit
          </label>
          <div class="relative">
            <input
              id="principal"
              type="number"
              bind:value={principal}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm font-medium">
              {currentCurrency}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="monthlyContribution" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} class="text-emerald-500" />
            Monthly Contribution
          </label>
          <div class="relative">
            <input
              id="monthlyContribution"
              type="number"
              bind:value={monthlyContribution}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm font-medium">
              {currentCurrency}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="rate" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingUp size={16} class="text-amber-500 rotate-45" />
            Annual Interest Rate (%)
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
          <label for="years" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar size={16} class="text-violet-500" />
            Number of Years
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
      <Card title="Growth Projection">
        <div class="h-[300px] w-full">
          <canvas bind:this={chartCanvas}></canvas>
        </div>
      </Card>

      <Card>
        <div class="flex flex-col items-center justify-center py-10 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl">
          <div class="text-blue-600/60 text-sm font-semibold uppercase tracking-wider mb-2">Estimated Future Value</div>
          <div class="text-5xl font-extrabold text-blue-600 tracking-tight">{result.total} {currentCurrency}</div>
          <div class="mt-4 text-gray-500 text-sm text-center px-6">
            Based on a {rate}% annual interest rate over {years} years.
          </div>
        </div>
      </Card>

      <Card title="Annual Overview">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr>
                <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Year</th>
                <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Balance</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              {#each result.breakdown as row}
                <tr class="hover:bg-gray-50/50 transition-colors">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">Year {row.year}</td>
                  <td class="px-6 py-4 text-sm font-bold text-blue-600">{row.balance} {currentCurrency}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</div>
