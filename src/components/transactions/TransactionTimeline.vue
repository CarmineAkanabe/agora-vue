<template>
  <div class="timeline">
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      :class="['timeline-step', step.state]"
    >
      <!-- Connector line (not on first item) -->
      <div v-if="index > 0" :class="['timeline-connector', step.state]"></div>

      <!-- Step indicator dot -->
      <div :class="['timeline-dot', step.state]">
        <!-- Checkmark for completed -->
        <svg v-if="step.state === 'completed'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <!-- X for failed/refunded terminal state -->
        <svg v-else-if="step.state === 'terminal'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <!-- Pulse ring for active -->
        <span v-else-if="step.state === 'active'" class="timeline-dot-pulse"></span>
      </div>

      <!-- Step content -->
      <div class="timeline-content">
        <p class="timeline-label">{{ step.label }}</p>
        <p class="timeline-description">{{ step.description }}</p>
        <p v-if="step.timestamp" class="timeline-timestamp">{{ step.timestamp }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/formatters'

const props = defineProps({
  status: { type: String, default: 'initiated' },
  createdAt: { type: String, default: null },
  pickupCodeUsedAt: { type: String, default: null },
})

/**
 * Build a visual timeline based on the transaction status.
 *
 * Normal flow: initiated → held → released
 * Terminal states: failed, refunded
 *
 * Each step has a `state`: completed | active | pending | terminal
 */
const steps = computed(() => {
  const s = props.status

  // Map status to a numeric rank for the normal flow
  const rank = { initiated: 0, held: 1, released: 2 }
  const currentRank = rank[s] ?? -1
  const isFailed = s === 'failed'
  const isRefunded = s === 'refunded'
  const isTerminal = isFailed || isRefunded

  const getState = (stepRank) => {
    if (isTerminal) {
      // For terminal states, mark step 0 as completed (payment was initiated)
      return stepRank === 0 ? 'completed' : 'pending'
    }
    if (stepRank < currentRank) return 'completed'
    if (stepRank === currentRank) return 'active'
    return 'pending'
  }

  const result = [
    {
      key: 'initiated',
      label: 'Payment Initiated',
      description: 'The buyer submitted payment via mobile money.',
      state: getState(0),
      timestamp: props.createdAt ? formatDate(props.createdAt) : null,
    },
    {
      key: 'held',
      label: 'Funds Held in Escrow',
      description: 'Payment confirmed by K-PAY. Funds are securely held until pickup.',
      state: getState(1),
      timestamp: null,
    },
    {
      key: 'released',
      label: 'Funds Released',
      description: 'Pickup code verified. Funds have been disbursed to the seller.',
      state: getState(2),
      timestamp: props.pickupCodeUsedAt ? formatDate(props.pickupCodeUsedAt) : null,
    },
  ]

  // Add terminal step if applicable
  if (isFailed) {
    result.push({
      key: 'failed',
      label: 'Payment Failed',
      description: 'The payment could not be processed by K-PAY. No funds were charged.',
      state: 'terminal',
      timestamp: null,
    })
  }

  if (isRefunded) {
    result.push({
      key: 'refunded',
      label: 'Funds Refunded',
      description: 'The payment has been returned to the buyer.',
      state: 'terminal',
      timestamp: null,
    })
  }

  return result
})
</script>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.timeline-step {
  display: flex;
  gap: var(--spacing-4);
  position: relative;
  padding-bottom: var(--spacing-6);
}

.timeline-step:last-child {
  padding-bottom: 0;
}

/* Connector line */
.timeline-connector {
  position: absolute;
  left: 11px;
  top: -2px;
  width: 2px;
  height: calc(var(--spacing-6) + 2px);
  transform: translateY(-100%);
}

.timeline-connector.completed {
  background: var(--color-success);
}

.timeline-connector.active {
  background: linear-gradient(to bottom, var(--color-success), var(--color-primary));
}

.timeline-connector.pending {
  background: var(--color-border);
}

.timeline-connector.terminal {
  background: linear-gradient(to bottom, var(--color-success), var(--color-danger));
}

/* Dot */
.timeline-dot {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.timeline-dot.completed {
  background-color: var(--color-success);
  color: var(--color-surface-1);
}

.timeline-dot.active {
  background-color: var(--color-primary);
  box-shadow: 0 0 0 4px var(--color-primary-ghost);
}

.timeline-dot.pending {
  background-color: var(--color-surface-3);
  border: 2px solid var(--color-border);
}

.timeline-dot.terminal {
  background-color: var(--color-danger);
  color: var(--color-surface-1);
}

.timeline-dot-pulse {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-text-1);
  animation: dot-pulse 1.5s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

/* Content */
.timeline-content {
  flex: 1;
  min-width: 0;
  padding-top: 1px;
}

.timeline-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.timeline-step.pending .timeline-label {
  color: var(--color-text-3);
}

.timeline-step.terminal .timeline-label {
  color: var(--color-danger);
}

.timeline-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-relaxed);
}

.timeline-step.pending .timeline-description {
  color: var(--color-text-3);
}

.timeline-timestamp {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: var(--spacing-1);
}
</style>
