<script>
  import Layout from './lib/components/layout/Layout.svelte';
  import SalesDashboard from './lib/views/SalesDashboard.svelte';
  import CompoundInterestCalculator from './lib/views/CompoundInterestCalculator.svelte';

  let currentView = $state('dashboard');

  function handleViewChange(view) {
    currentView = view;
  }
</script>

<Layout {currentView} onViewChange={handleViewChange}>
  {#if currentView === 'dashboard'}
    <SalesDashboard />
  {:else if currentView === 'calculator'}
    <CompoundInterestCalculator />
  {/if}
</Layout>
