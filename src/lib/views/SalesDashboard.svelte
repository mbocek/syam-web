<script>
  import Card from '../components/ui/Card.svelte';
  import { 
    TrendingUp, 
    ShoppingCart, 
    Users, 
    DollarSign, 
    ArrowUpRight, 
    ArrowDownRight,
    Download,
    Calendar,
    Search
  } from 'lucide-svelte';
  
  let stats = [
    { label: 'Total Sales', value: '$34,500', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: '1,250', change: '+8.2%', trend: 'up', icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Customers', value: '450', change: '-2.4%', trend: 'down', icon: Users, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Profit', value: '$12,300', change: '+15.1%', trend: 'up', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-50' }
  ];
</script>

<div class="flex flex-col gap-6">
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    <div>
      <h2 class="m-0 text-2xl font-bold text-gray-900">Sales Dashboard</h2>
      <p class="text-gray-500 text-sm">Welcome back! Here's what's happening today.</p>
    </div>
    <div class="flex gap-3">
      <button class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors shadow-xs">
        <Calendar size={18} />
        <span>Oct 2023</span>
      </button>
      <button class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium cursor-pointer bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm">
        <Download size={18} />
        <span>Download Report</span>
      </button>
    </div>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each stats as stat}
      <Card>
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1">
            <span class="text-gray-500 text-sm font-medium">{stat.label}</span>
            <span class="text-2xl font-bold text-gray-900">{stat.value}</span>
          </div>
          <div class="p-2 rounded-lg {stat.bg} {stat.color}">
            <stat.icon size={20} />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-1">
          <span class="flex items-center font-semibold text-sm {stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}">
            {#if stat.trend === 'up'}
              <ArrowUpRight size={16} />
            {:else}
              <ArrowDownRight size={16} />
            {/if}
            {stat.change}
          </span>
          <span class="text-gray-400 text-xs font-normal ml-1">vs last month</span>
        </div>
      </Card>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card title="Sales Revenue">
      <div class="h-[300px] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 rounded-xl gap-2">
        <TrendingUp size={48} strokeWidth={1} />
        <span class="font-medium text-sm">Sales Chart Placeholder</span>
      </div>
    </Card>
    <Card title="Order Status">
      <div class="h-[300px] bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 rounded-xl gap-2">
        <ShoppingCart size={48} strokeWidth={1} />
        <span class="font-medium text-sm">Order Status Chart Placeholder</span>
      </div>
    </Card>
  </div>

  <Card title="Recent Transactions">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-left">
        <thead>
          <tr>
            <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Order ID</th>
            <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Customer</th>
            <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Date</th>
            <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Amount</th>
            <th class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 font-semibold text-xs uppercase tracking-wider text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#ORD-7823</td>
            <td class="px-6 py-4 text-sm text-gray-600">John Doe</td>
            <td class="px-6 py-4 text-sm text-gray-500">Oct 24, 2023</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">$120.00</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Completed
              </span>
            </td>
          </tr>
          <tr class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#ORD-7824</td>
            <td class="px-6 py-4 text-sm text-gray-600">Jane Smith</td>
            <td class="px-6 py-4 text-sm text-gray-500">Oct 25, 2023</td>
            <td class="px-6 py-4 text-sm font-semibold text-gray-900">$85.50</td>
            <td class="px-6 py-4">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Pending
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </Card>
</div>
