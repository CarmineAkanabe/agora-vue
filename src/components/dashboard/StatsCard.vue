<template>
  <div class="card p-5 stats-card">
    <div class="stats-card-header">
      <div class="stats-card-title">{{ title }}</div>
      <div v-if="$slots.icon" class="stats-card-icon">
        <slot name="icon"></slot>
      </div>
    </div>
    
    <div class="mt-4">
      <div class="stats-card-value">
        <template v-if="loading">
          <div class="skeleton h-8 w-1/2 rounded" />
        </template>
        <template v-else>
          {{ format ? formatFn(value) : value }}
        </template>
      </div>
      
      <div v-if="!loading && (trend !== undefined || subtitle)" class="stats-card-footer mt-2">
        <span v-if="trend !== undefined" :class="['stats-trend', trendClass]">
          <svg v-if="trend > 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
          <svg v-else-if="trend < 0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
          </svg>
          <span v-else class="text-text-3 font-medium text-xs mr-1">-</span>
          {{ Math.abs(trend) }}%
        </span>
        <span v-if="subtitle" class="stats-subtitle">{{ subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils/formatters'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [Number, String], default: 0 },
  loading: { type: Boolean, default: false },
  format: { type: String, default: null }, // 'currency', etc.
  trend: { type: Number, default: undefined },
  subtitle: { type: String, default: '' }
})

const formatFn = computed(() => {
  if (props.format === 'currency') return formatPrice
  return (val) => val
})

const trendClass = computed(() => {
  if (props.trend > 0) return 'text-success'
  if (props.trend < 0) return 'text-danger'
  return 'text-text-3'
})
</script>

<style scoped>
.stats-card {
  display: flex;
  flex-direction: column;
}

.stats-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.stats-card-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
}

.stats-card-icon {
  color: var(--color-primary);
  opacity: 0.8;
  padding: 6px;
  background-color: var(--color-primary-ghost);
  border-radius: var(--radius-md);
}

.stats-card-value {
  font-size: 2rem;
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
  line-height: 1.2;
}

.stats-card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.stats-trend {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.stats-subtitle {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
}
</style>
