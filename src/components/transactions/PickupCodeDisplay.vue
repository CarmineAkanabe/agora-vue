<template>
  <div v-if="code" class="pickup-display">
    <div class="pickup-display-header">
      <div class="pickup-display-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </div>
      <div>
        <p class="pickup-display-label">Your Pickup Code</p>
        <p class="pickup-display-hint">Show this code to the seller when you meet on campus</p>
      </div>
    </div>

    <!-- Code digits -->
    <div class="pickup-display-code">
      <span
        v-for="(digit, index) in codeDigits"
        :key="index"
        class="pickup-digit"
      >
        {{ digit }}
      </span>
    </div>

    <!-- Verified state -->
    <div v-if="usedAt" class="pickup-display-verified">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span>Code verified {{ formattedUsedAt }}</span>
    </div>

    <!-- Active instruction -->
    <p v-else class="pickup-display-instruction">
      Do not share this code until you have received your item and confirmed it matches the listing description.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRelative } from '@/utils/formatters'

const props = defineProps({
  code:   { type: String, default: null },
  usedAt: { type: String, default: null },
})

const codeDigits = computed(() => {
  if (!props.code) return []
  return props.code.split('')
})

const formattedUsedAt = computed(() => {
  return props.usedAt ? formatRelative(props.usedAt) : ''
})
</script>

<style scoped>
.pickup-display {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(34, 34, 44, 0.6);
  backdrop-filter: blur(8px);
  padding: var(--spacing-5) var(--spacing-6);
}

.pickup-display-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.pickup-display-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-accent-ghost);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pickup-display-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.pickup-display-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: 2px;
}

.pickup-display-code {
  display: flex;
  justify-content: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-5);
}

.pickup-digit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 56px;
  border-radius: var(--radius-md);
  background-color: var(--color-surface-3);
  border: 1px solid var(--color-border);
  font-family: var(--font-mono);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-accent);
  letter-spacing: 0;
}

.pickup-display-verified {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-4);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-base);
  background-color: var(--color-success-ghost);
  color: var(--color-success);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.pickup-display-instruction {
  margin-top: var(--spacing-4);
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  text-align: center;
  line-height: var(--line-height-relaxed);
}
</style>
