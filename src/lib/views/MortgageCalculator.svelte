<script>
  import Card from '../components/ui/Card.svelte';
  import { House, TrendingDown, Calendar, ChartArea, Wallet, CreditCard } from 'lucide-svelte';
  import { i18n } from '../stores/language.svelte.js';
  import { Chart, registerables } from 'chart.js';

  Chart.register(...registerables);

  let chartCanvas = $state();
  let chart = null;

  let amount = $state(1000000);
  let rate = $state(4.5);
  let years = $state(30);

  let monthlyPayment = $derived.by(() => {
    const monthlyRate = (rate / 100) / 12;
    const numberOfPayments = years * 12;
    if (monthlyRate === 0) return amount / numberOfPayments;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return payment;
  });

  let schedule = $derived.by(() => {
    let balance = amount;
    const monthlyRate = (rate / 100) / 12;
    const numberOfPayments = years * 12;
    const payment = monthlyPayment;
    
    let data = [];
    let totalInterest = 0;
    let totalPrincipal = 0;
    
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let m = 1; m <= numberOfPayments; m++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = payment - interestPayment;
      
      balance -= principalPayment;
      if (balance < 0) balance = 0;

      yearlyPrincipal += principalPayment;
      yearlyInterest += interestPayment;
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;

      if (m % 12 === 0 || m === numberOfPayments) {
        data.push({
          year: Math.ceil(m / 12),
          principal: yearlyPrincipal.toFixed(2),
          interest: yearlyInterest.toFixed(2),
          balance: balance.toFixed(2)
        });
        yearlyPrincipal = 0;
        yearlyInterest = 0;
      }
    }

    return {
      breakdown: data,
      totalInterest: totalInterest.toFixed(2),
      totalRepayment: (amount + totalInterest).toFixed(2)
    };
  });

  $effect(() => {
    if (chartCanvas && schedule.breakdown.length > 0) {
      const ctx = chartCanvas.getContext('2d');
      const labels = schedule.breakdown.map(d => `${i18n.t('calculator.year')} ${d.year}`);
      
      const datasets = [
        {
          label: `${i18n.t('mortgage.balance')} (${i18n.currency})`,
          data: schedule.breakdown.map(d => d.balance),
          fill: true,
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderColor: 'rgb(37, 99, 235)',
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 5,
        }
      ];

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
                beginAtZero: true,
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
      {i18n.t('mortgage.title')}
    </h1>
    <p class="mt-4 text-lg text-gray-500">
      {i18n.t('mortgage.description')}
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <Card title={i18n.t('mortgage.parameters')}>
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-1.5">
          <label for="amount" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Wallet size={16} class="text-blue-500" />
            {i18n.t('mortgage.amount')}
          </label>
          <div class="relative">
            <input
              id="amount"
              type="number"
              bind:value={amount}
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm font-medium">
              {i18n.currency}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-1.5">
          <label for="rate" class="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <TrendingDown size={16} class="text-amber-500" />
            {i18n.t('mortgage.rate')}
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
            {i18n.t('mortgage.years')}
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div class="flex flex-col items-center justify-center py-6 bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div class="text-blue-600/60 text-xs font-semibold uppercase tracking-wider mb-1">{i18n.t('mortgage.monthlyPayment')}</div>
            <div class="text-3xl font-extrabold text-blue-600 tracking-tight">{i18n.formatNumber(monthlyPayment)} {i18n.currency}</div>
          </div>
        </Card>
        <Card>
          <div class="flex flex-col items-center justify-center py-6 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl">
            <div class="text-emerald-600/60 text-xs font-semibold uppercase tracking-wider mb-1">{i18n.t('mortgage.totalRepayment')}</div>
            <div class="text-3xl font-extrabold text-emerald-600 tracking-tight">{i18n.formatNumber(schedule.totalRepayment)} {i18n.currency}</div>
          </div>
        </Card>
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
