<script>
  import Layout from '$lib/components/layout/Layout.svelte';
  import '../app.css';

  let { data, children } = $props();
</script>

<Layout {data}>
  {@render children()}
</Layout>
