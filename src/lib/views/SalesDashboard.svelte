<script>
  import Card from '../components/ui/Card.svelte';
  
  let stats = [
    { label: 'Total Sales', value: '$34,500', change: '+12.5%', color: 'blue' },
    { label: 'Total Orders', value: '1,250', change: '+8.2%', color: 'green' },
    { label: 'Customers', value: '450', change: '-2.4%', color: 'orange' },
    { label: 'Profit', value: '$12,300', change: '+15.1%', color: 'purple' }
  ];
</script>

<div class="sales-dashboard">
  <div class="page-header">
    <h2>Sales Dashboard</h2>
    <div class="actions">
      <button class="btn btn-primary">Download Report</button>
    </div>
  </div>

  <div class="stats-grid">
    {#each stats as stat}
      <Card>
        <div class="stat-content">
          <div class="stat-label">{stat.label}</div>
          <div class="stat-value">{stat.value}</div>
          <div class="stat-change" class:positive={stat.change.startsWith('+')} class:negative={stat.change.startsWith('-')}>
            {stat.change} <span>vs last month</span>
          </div>
        </div>
      </Card>
    {/each}
  </div>

  <div class="charts-grid">
    <Card title="Sales Revenue">
      <div class="chart-placeholder">Sales Chart Placeholder</div>
    </Card>
    <Card title="Order Status">
      <div class="chart-placeholder">Order Status Chart Placeholder</div>
    </Card>
  </div>

  <Card title="Recent Transactions">
    <table class="data-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>#ORD-7823</td>
          <td>John Doe</td>
          <td>Oct 24, 2023</td>
          <td>$120.00</td>
          <td><span class="badge badge-success">Completed</span></td>
        </tr>
        <tr>
          <td>#ORD-7824</td>
          <td>Jane Smith</td>
          <td>Oct 25, 2023</td>
          <td>$85.50</td>
          <td><span class="badge badge-pending">Pending</span></td>
        </tr>
      </tbody>
    </table>
  </Card>
</div>

<style>
  .sales-dashboard {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .page-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-label {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #111827;
  }

  .stat-change {
    font-size: 0.75rem;
    font-weight: 600;
  }

  .stat-change.positive { color: #10b981; }
  .stat-change.negative { color: #ef4444; }
  .stat-change span { color: #6b7280; font-weight: normal; }

  .charts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
  }

  .chart-placeholder {
    height: 300px;
    background-color: #f9fafb;
    border: 2px dashed #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9ca3af;
    border-radius: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    border: 1px solid transparent;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }

  .data-table th, .data-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .data-table th {
    background-color: #f9fafb;
    font-weight: 600;
    font-size: 0.875rem;
    color: #374151;
  }

  .badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
  }

  .badge-success { background-color: #d1fae5; color: #065f46; }
  .badge-pending { background-color: #fef3c7; color: #92400e; }
</style>
