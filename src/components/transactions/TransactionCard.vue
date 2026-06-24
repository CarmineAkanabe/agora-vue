<template>
  <article class="card transaction-card">
    <div class="transaction-card-header">
      <div class="transaction-card-info">
        <div class="transaction-card-title-row">
          <h3 class="transaction-card-title">
            {{ listingTitle }}
          </h3>
          <Badge :variant="statusVariant" :dot="transaction.status === 'initiated'">
            {{ statusLabel }}
          </Badge>
        </div>

        <div class="transaction-card-meta">
          <span class="transaction-card-party">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {{ otherPartyLabel }}
          </span>
          <span class="transaction-card-dot">·</span>
          <span class="transaction-card-method">{{ paymentMethodLabel }}</span>
          <span class="transaction-card-dot">·</span>
          <span>{{ formatDateShort(transaction.created_at) }}</span>
        </div>
      </div>

      <div class="transaction-card-amount">
        <p class="price">{{ formatPrice(transaction.amount) }}</p>
      </div>
    </div>

    <div class="transaction-card-footer">
      <router-link
        :to="{ name: 'transaction-detail', params: { id: transaction.id } }"
        class="btn btn-secondary btn-sm"
      >
        View details
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </router-link>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import Badge from '@/components/ui/Badge.vue'
import { formatDateShort, formatPrice } from '@/utils/formatters'
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
} from '@/utils/constants'
import { useAuthStore } from '@/stores/useAuthStore'

const props = defineProps({ transaction: { type: Object, required: true } })

const auth = useAuthStore()

const statusLabel = computed(
  () => TRANSACTION_STATUS_LABELS[props.transaction.status] || props.transaction.status,
)
const statusVariant = computed(
  () => TRANSACTION_STATUS_VARIANTS[props.transaction.status] || 'info',
)

const paymentMethodLabel = computed(
  () => PAYMENT_METHOD_LABELS[props.transaction.payment_method] || props.transaction.payment_method || '—',
)

const listingTitle = computed(
  () => props.transaction.purchase_request?.listing?.title || 'Transaction',
)

/**
 * Show the other party's name relative to the current user.
 * If the current user is the buyer, show "Seller: <name>".
 * If the current user is the seller, show "Buyer: <name>".
 */
const otherPartyLabel = computed(() => {
  const isBuyer = auth.user?.id === props.transaction.buyer?.id
  if (isBuyer) {
    return `Seller: ${props.transaction.seller?.name || '—'}`
  }
  return `Buyer: ${props.transaction.buyer?.name || '—'}`
})
</script>

<style scoped>
.transaction-card {
  padding: var(--spacing-5) var(--spacing-6);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.transaction-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow-primary);
}

.transaction-card-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.transaction-card-info {
  flex: 1;
  min-width: 0;
}

.transaction-card-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.transaction-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.transaction-card-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: var(--spacing-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-3);
  flex-wrap: wrap;
}

.transaction-card-party {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
  color: var(--color-text-2);
}

.transaction-card-dot {
  color: var(--color-border);
}

.transaction-card-method {
  color: var(--color-text-2);
}

.transaction-card-amount {
  text-align: right;
  flex-shrink: 0;
}

.transaction-card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}
</style>
