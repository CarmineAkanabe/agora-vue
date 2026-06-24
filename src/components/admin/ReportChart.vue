<template>
  <div class="card p-6 report-chart-container h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-text-1">{{ title }}</h3>
        <p v-if="subtitle" class="text-sm text-text-3 mt-1">{{ subtitle }}</p>
      </div>
      <slot name="action"></slot>
    </div>

    <div class="flex-1 min-h-[300px] flex items-center justify-center relative">
      <template v-if="loading">
        <div class="skeleton w-full h-[250px] rounded-xl" />
      </template>

      <template v-else-if="!hasData">
        <div class="text-center text-text-3 flex flex-col items-center justify-center h-full">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-3 opacity-50">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <p class="font-medium text-text-2">Not enough data</p>
          <p class="text-sm mt-1">There isn't enough activity to generate this chart yet.</p>
        </div>
      </template>

      <template v-else>
        <div class="w-full h-[300px]">
          <VueApexCharts
            :type="type"
            width="100%"
            height="100%"
            :options="mergedOptions"
            :series="series"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  type: { type: String, default: 'bar' },
  series: { type: Array, required: true },
  options: { type: Object, default: () => ({}) },
  loading: { type: Boolean, default: false }
})

const hasData = computed(() => {
  return props.series && props.series.length > 0 && props.series.some(s => s.data && s.data.length > 0)
})

// Merge user options with our dark theme defaults
const mergedOptions = computed(() => {
  return {
    chart: {
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, sans-serif'
    },
    theme: { mode: 'dark' },
    colors: ['#7c3aed', '#ec4899', '#3b82f6', '#10b981'],
    grid: {
      borderColor: '#373748', // var(--color-border)
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } }
    },
    xaxis: {
      labels: { style: { colors: '#9ca3af' } }, // text-3
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { style: { colors: '#9ca3af' } }
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val) => val }
    },
    ...props.options
  }
})
</script>

<style scoped>
/* Override apexcharts specific dark theme background to match our surface */
:deep(.apexcharts-tooltip) {
  background: var(--color-surface-2) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-lg) !important;
}
:deep(.apexcharts-tooltip-title) {
  background: var(--color-surface-3) !important;
  border-bottom: 1px solid var(--color-border) !important;
  font-weight: 600 !important;
}
</style>
