<script>
  import { i18n } from '$lib/stores/language.svelte.js';
  import Dashboard from '$lib/views/Dashboard.svelte';
</script>

<svelte:head>
	<title>{i18n.t('dashboard.welcome')} | SYAM</title>
	<meta name="description" content={i18n.t('dashboard.description')} />
</svelte:head>

<Dashboard />
