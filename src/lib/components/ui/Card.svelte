<script>
  let { title, children, footer } = $props();
</script>

<div class="card">
  {#if title}
    <div class="card-header">
      <h3 class="card-title">{title}</h3>
    </div>
  {/if}
  
  <div class="card-body">
    {@render children()}
  </div>

  {#if footer}
    <div class="card-footer">
      {@render footer()}
    </div>
  {/if}
</div>

<style>
  .card {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    margin-bottom: 1.5rem;
  }

  .card-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .card-title {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  .card-body {
    padding: 1.5rem;
    flex: 1;
  }

  .card-footer {
    padding: 1rem 1.5rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }
</style>
