<script>
  import Card from './Card.svelte';

  let {
    label,
    value,
    size = 'md', // 'md' or 'lg'
    tone = 'blue', // 'blue' or 'emerald'
    children
  } = $props();

  const tones = {
    blue: 'from-blue-50 to-indigo-50 text-blue-600',
    emerald: 'from-emerald-50 to-teal-50 text-emerald-600'
  };

  const sizes = {
    md: { wrapper: 'py-6', label: 'text-xs mb-1', value: 'text-3xl' },
    lg: { wrapper: 'py-10', label: 'text-sm mb-2', value: 'text-5xl' }
  };

  let toneClasses = $derived(tones[tone] ?? tones.blue);
  let s = $derived(sizes[size] ?? sizes.md);
</script>

<Card>
  <div class="flex flex-col items-center justify-center {s.wrapper} bg-linear-to-br {toneClasses} rounded-xl">
    <div class="{s.label} font-semibold uppercase tracking-wider opacity-60">{label}</div>
    <div class="{s.value} font-extrabold tracking-tight">{value}</div>
    {#if children}
      {@render children()}
    {/if}
  </div>
</Card>
