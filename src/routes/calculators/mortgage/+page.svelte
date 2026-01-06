<script>
  import { i18n } from '$lib/stores/language.svelte.js';
  import MortgageCalculator from '$lib/views/MortgageCalculator.svelte';
</script>

<svelte:head>
	<title>{i18n.t('mortgage.title')} | SYAM</title>
	<meta name="description" content={i18n.t('mortgage.description')} />
</svelte:head>

<MortgageCalculator />
