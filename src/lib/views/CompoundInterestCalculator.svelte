<script>
  import Card from '../components/ui/Card.svelte';

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
</script>

<div class="flex flex-col gap-6">
  <div class="flex justify-between items-center">
    <h2 class="m-0 text-2xl font-bold">Compound Interest Calculator</h2>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card title="Parameters">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <label for="principal" class="text-sm font-medium text-gray-700">Initial Deposit</label>
          <input
            id="principal"
            type="number"
            bind:value={principal}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="monthlyContribution" class="text-sm font-medium text-gray-700">Monthly Contribution</label>
          <input
            id="monthlyContribution"
            type="number"
            bind:value={monthlyContribution}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="rate" class="text-sm font-medium text-gray-700">Annual Interest Rate (%)</label>
          <input
            id="rate"
            type="number"
            step="0.1"
            bind:value={rate}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex flex-col gap-1">
          <label for="years" class="text-sm font-medium text-gray-700">Number of Years</label>
          <input
            id="years"
            type="number"
            bind:value={years}
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </Card>

    <div class="md:col-span-2 flex flex-col gap-6">
      <Card>
        <div class="flex flex-col items-center justify-center py-8">
          <div class="text-gray-500 text-sm font-medium mb-1">Future Value</div>
          <div class="text-4xl font-bold text-blue-600">{result.total} €</div>
        </div>
      </Card>

      <Card title="Annual Overview">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-left">
            <thead>
              <tr>
                <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Year</th>
                <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Balance</th>
              </tr>
            </thead>
            <tbody>
              {#each result.breakdown as row}
                <tr>
                  <td class="px-4 py-3 border-b border-gray-200">{row.year}</td>
                  <td class="px-4 py-3 border-b border-gray-200 font-medium">{row.balance} €</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  </div>
</div>
