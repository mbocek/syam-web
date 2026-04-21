<script>
  import { app } from '$lib/apps/budget/state/app.svelte';
  import WelcomeWizard from '$lib/apps/budget/components/welcome/WelcomeWizard.svelte';

  let { children } = $props();
</script>

{#if !app.isReady}
  <WelcomeWizard />
{:else}
  {@render children()}
{/if}
