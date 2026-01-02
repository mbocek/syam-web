<script>
  import Layout from '$lib/components/layout/Layout.svelte';
  import '../app.css';

  let { children } = $props();
</script>

<Layout>
  {@render children()}
</Layout>
