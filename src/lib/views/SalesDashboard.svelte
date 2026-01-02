<script>
  import Card from '../components/ui/Card.svelte';
  
  let stats = [
    { label: 'Total Sales', value: '$34,500', change: '+12.5%', color: 'blue' },
    { label: 'Total Orders', value: '1,250', change: '+8.2%', color: 'green' },
    { label: 'Customers', value: '450', change: '-2.4%', color: 'orange' },
    { label: 'Profit', value: '$12,300', change: '+15.1%', color: 'purple' }
  ];
</script>

<div class="flex flex-col gap-4">
  <div class="flex justify-between items-center mb-4">
    <h2 class="m-0 text-2xl font-bold">Sales Dashboard</h2>
    <div>
      <button class="px-4 py-2 rounded-md font-medium cursor-pointer border border-transparent bg-blue-500 text-white">Download Report</button>
    </div>
  </div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
    {#each stats as stat}
      <Card>
        <div class="flex flex-col gap-2">
          <div class="text-gray-500 text-sm font-medium">{stat.label}</div>
          <div class="text-2xl font-bold text-gray-900">{stat.value}</div>
          <div class="text-xs font-semibold {stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}">
            {stat.change} <span class="text-gray-500 font-normal">vs last month</span>
          </div>
        </div>
      </Card>
    {/each}
  </div>

  <div class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
    <Card title="Sales Revenue">
      <div class="h-[300px] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center color-gray-400 rounded-lg">Sales Chart Placeholder</div>
    </Card>
    <Card title="Order Status">
      <div class="h-[300px] bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center color-gray-400 rounded-lg">Order Status Chart Placeholder</div>
    </Card>
  </div>

  <Card title="Recent Transactions">
    <table class="w-full border-collapse text-left">
      <thead>
        <tr>
          <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Order ID</th>
          <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Customer</th>
          <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Date</th>
          <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Amount</th>
          <th class="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-sm text-gray-700">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="px-4 py-3 border-b border-gray-200">#ORD-7823</td>
          <td class="px-4 py-3 border-b border-gray-200">John Doe</td>
          <td class="px-4 py-3 border-b border-gray-200">Oct 24, 2023</td>
          <td class="px-4 py-3 border-b border-gray-200">$120.00</td>
          <td class="px-4 py-3 border-b border-gray-200"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">Completed</span></td>
        </tr>
        <tr>
          <td class="px-4 py-3 border-b border-gray-200">#ORD-7824</td>
          <td class="px-4 py-3 border-b border-gray-200">Jane Smith</td>
          <td class="px-4 py-3 border-b border-gray-200">Oct 25, 2023</td>
          <td class="px-4 py-3 border-b border-gray-200">$85.50</td>
          <td class="px-4 py-3 border-b border-gray-200"><span class="px-2 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">Pending</span></td>
        </tr>
      </tbody>
    </table>
  </Card>
</div>
