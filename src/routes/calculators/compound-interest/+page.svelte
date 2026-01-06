<script>
  import { i18n } from '$lib/stores/language.svelte.js';
  import CompoundInterestCalculator from '$lib/views/CompoundInterestCalculator.svelte';
</script>

<svelte:head>
	<title>{i18n.t('calculator.title')} | SYAM</title>
	<meta name="description" content={i18n.t('calculator.description')} />
</svelte:head>

<CompoundInterestCalculator />
