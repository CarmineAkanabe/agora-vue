<template>
  <div :class="['escrow-card', `escrow-${status}`]">
    <!-- Header -->
    <div class="escrow-header">
      <div class="escrow-header-left">
        <div :class="['escrow-indicator', status]">
          <span v-if="status === 'initiated'" class="escrow-pulse"></span>
          <svg v-else-if="status === 'held'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <svg v-else-if="status === 'released'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else-if="status === 'failed'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
        </div>
        <div>
          <p class="escrow-label">Escrow Status</p>
          <p class="escrow-status-text">{{ label }}</p>
        </div>
      </div>
      <Badge :variant="variant">{{ label }}</Badge>
    </div>

    <!-- Description -->
    <p class="escrow-description">{{ description }}</p>

    <!-- Payment method -->
    <div v-if="paymentMethod" class="escrow-detail">
      <span class="escrow-detail-label">Payment method</span>
      <span class="escrow-detail-value">{{ paymentMethodLabel }}</span>
    </div>

    <!-- Auto-release countdown (only for held) -->
    <div v-if="status === 'held' && autoReleaseText" class="escrow-countdown">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>Auto-release: {{ autoReleaseText }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
} from '@/utils/constants'
import { formatCountdown } from '@/utils/formatters'

const props = defineProps({
  status:        { type: String, default: 'initiated' },
  paymentMethod: { type: String, default: null },
  autoReleaseAt: { type: String, default: null },
})

const label   = computed(() => TRANSACTION_STATUS_LABELS[props.status] || props.status)
const variant = computed(() => TRANSACTION_STATUS_VARIANTS[props.status] || 'info')

const paymentMethodLabel = computed(
  () => PAYMENT_METHOD_LABELS[props.paymentMethod] || props.paymentMethod || '—',
)

const descriptions = {
  initiated: 'Your payment is being processed by K-PAY. This may take a few moments — the status will update automatically once confirmed.',
  held:      'Funds are securely held in escrow. The buyer and seller should arrange a campus meetup. The pickup code must be verified to release the funds.',
  released:  'The pickup code was verified and funds have been disbursed to the seller. This transaction is complete.',
  refunded:  'The funds have been returned to the buyer. No further action is needed.',
  failed:    'The payment could not be confirmed by K-PAY. No funds were charged. You may try initiating payment again.',
}

const description = computed(() => descriptions[props.status] || 'Transaction status is being determined.')

// Auto-release countdown (ticks every 30s)
const autoReleaseText = ref(null)
let countdownTimer = null

const updateCountdown = () => {
  if (props.autoReleaseAt) {
    autoReleaseText.value = formatCountdown(props.autoReleaseAt)
  }
}

onMounted(() => {
  updateCountdown()
  if (props.status === 'held' && props.autoReleaseAt) {
    countdownTimer = setInterval(updateCountdown, 30000)
  }
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.escrow-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(34, 34, 44, 0.6);
  backdrop-filter: blur(8px);
  padding: var(--spacing-5) var(--spacing-6);
}

.escrow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.escrow-header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.escrow-indicator {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.escrow-indicator.initiated {
  background-color: var(--color-info-ghost);
  color: var(--color-info);
}

.escrow-indicator.held {
  background-color: var(--color-warning-ghost);
  color: var(--color-warning);
}

.escrow-indicator.released {
  background-color: var(--color-success-ghost);
  color: var(--color-success);
}

.escrow-indicator.failed {
  background-color: var(--color-danger-ghost);
  color: var(--color-danger);
}

.escrow-indicator.refunded {
  background-color: var(--color-info-ghost);
  color: var(--color-info);
}

.escrow-pulse {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  background-color: var(--color-info);
  animation: pulse-escrow 1.5s ease-in-out infinite;
}

@keyframes pulse-escrow {
  0%, 100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 var(--color-info-ghost); }
  50% { opacity: 0.6; transform: scale(0.85); box-shadow: 0 0 0 8px transparent; }
}

.escrow-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.escrow-status-text {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
  margin-top: 2px;
}

.escrow-description {
  margin-top: var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  line-height: var(--line-height-relaxed);
}

.escrow-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--spacing-3);
  padding-top: var(--spacing-3);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

.escrow-detail-label {
  color: var(--color-text-3);
}

.escrow-detail-value {
  color: var(--color-text-1);
  font-weight: var(--font-weight-medium);
}

.escrow-countdown {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--radius-base);
  background-color: var(--color-warning-ghost);
  color: var(--color-warning);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}
</style>
