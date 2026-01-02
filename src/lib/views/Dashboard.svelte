<script>
  import Card from '../components/ui/Card.svelte';
  import { t } from '../stores/language.js';
  import { 
    Info,
    Calculator,
    Languages,
    Cpu,
    ArrowRight
  } from 'lucide-svelte';
</script>

<div class="flex flex-col gap-8 max-w-4xl mx-auto">
  <div class="text-center">
    <h2 class="m-0 text-3xl font-bold text-gray-900">{$t('dashboard.welcome')}</h2>
    <p class="text-gray-500 text-lg mt-2">{$t('dashboard.description')}</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <Card>
      <div class="flex flex-col items-center text-center gap-4">
        <div class="p-3 rounded-full bg-blue-50 text-blue-600">
          <Calculator size={32} />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 m-0">Calculators</h3>
        <p class="text-sm text-gray-500 m-0">{$t('dashboard.features.calculators')}</p>
      </div>
    </Card>

    <Card>
      <div class="flex flex-col items-center text-center gap-4">
        <div class="p-3 rounded-full bg-emerald-50 text-emerald-600">
          <Languages size={32} />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 m-0">Languages</h3>
        <p class="text-sm text-gray-500 m-0">{$t('dashboard.features.multilingual')}</p>
      </div>
    </Card>

    <Card>
      <div class="flex flex-col items-center text-center gap-4">
        <div class="p-3 rounded-full bg-violet-50 text-violet-600">
          <Cpu size={32} />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 m-0">Technology</h3>
        <p class="text-sm text-gray-500 m-0">{$t('dashboard.features.modern')}</p>
      </div>
    </Card>
  </div>

  <div class="bg-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
    <div class="flex flex-col gap-2">
      <h3 class="text-xl font-bold m-0">Ready to start?</h3>
      <p class="text-blue-100 m-0">{$t('dashboard.getStarted')}</p>
    </div>
    <div class="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
      <Info size={20} />
      <span class="font-medium text-sm">v1.0.0</span>
    </div>
  </div>
</div>
