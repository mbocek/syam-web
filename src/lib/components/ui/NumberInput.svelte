<script>
  let {
    id,
    label,
    value = $bindable(),
    icon: Icon,
    iconClass = 'text-blue-500',
    suffix,
    step,
    min
  } = $props();
</script>

<div class="flex flex-col gap-1.5">
  <label for={id} class="text-sm font-semibold text-gray-700 flex items-center gap-2">
    {#if Icon}
      <Icon size={16} class={iconClass} />
    {/if}
    {label}
  </label>
  <div class="relative">
    <input
      {id}
      type="number"
      {step}
      {min}
      bind:value
      class="w-full pl-3 {suffix ? 'pr-10' : 'pr-3'} py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
    />
    {#if suffix}
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 text-sm font-medium">
        {suffix}
      </div>
    {/if}
  </div>
</div>
