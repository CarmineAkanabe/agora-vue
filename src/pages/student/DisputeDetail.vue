<template>
  <section class="container section space-y-6">

    <!-- Page header -->
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Dispute details</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Dispute overview</h1>
      <p class="mt-3 text-lg text-text-2">
        View the details and resolution status of this dispute.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="disputeStore.loading && !dispute" class="space-y-4">
      <div class="card p-6">
        <div class="skeleton h-8 w-2/5 rounded mb-4" />
        <div class="skeleton h-4 w-3/5 rounded mb-2" />
        <div class="skeleton h-4 w-1/3 rounded" />
      </div>
    </div>

    <!-- Content -->
    <template v-else-if="dispute">

      <!-- Status + reason -->
      <div class="card p-6">
        <div class="dispute-detail-header">
          <div>
            <h2 class="text-2xl font-semibold text-text-1">Dispute #{{ dispute.id }}</h2>
            <p class="mt-2 text-sm text-text-3">
              Raised {{ formatDate(dispute.created_at) }}
            </p>
          </div>
          <Badge :variant="statusVariant">{{ statusLabel }}</Badge>
        </div>

        <div class="dispute-detail-reason">
          <p class="dispute-detail-reason-label">Reason</p>
          <p class="dispute-detail-reason-text">{{ dispute.reason }}</p>
        </div>
      </div>

      <!-- Resolution (if resolved) -->
      <div v-if="dispute.status === 'resolved' && dispute.resolution" class="resolution-card">
        <div class="resolution-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div>
          <p class="resolution-title">Admin Resolution</p>
          <p class="resolution-text">{{ dispute.resolution }}</p>
          <p v-if="dispute.resolved_at" class="resolution-date">
            Resolved {{ formatDate(dispute.resolved_at) }}
            <template v-if="dispute.resolved_by">
              by {{ dispute.resolved_by.name }}
            </template>
          </p>
        </div>
      </div>

      <!-- Closed notice -->
      <div v-else-if="dispute.status === 'closed'" class="closed-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <div>
          <p class="closed-title">Dispute Closed</p>
          <p class="closed-text">This dispute was closed without a formal resolution.</p>
        </div>
      </div>

      <!-- Open notice -->
      <div v-else-if="dispute.status === 'open'" class="open-card">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <div>
          <p class="open-title">Under Review</p>
          <p class="open-text">
            An admin is reviewing this dispute. You will be notified once a resolution is reached.
          </p>
        </div>
      </div>

      <!-- Transaction info -->
      <div v-if="dispute.transaction" class="card p-6">
        <h3 class="text-lg font-semibold text-text-1 mb-4">Related Transaction</h3>
        <div class="dispute-tx-grid">
          <div class="dispute-tx-field">
            <span class="dispute-tx-label">Transaction</span>
            <span class="dispute-tx-value">#{{ dispute.transaction.id }}</span>
          </div>
          <div class="dispute-tx-field">
            <span class="dispute-tx-label">Amount</span>
            <span class="dispute-tx-value price">{{ formatPrice(dispute.transaction.amount) }}</span>
          </div>
          <div class="dispute-tx-field">
            <span class="dispute-tx-label">Status</span>
            <Badge :variant="txStatusVariant">{{ txStatusLabel }}</Badge>
          </div>
          <div class="dispute-tx-field">
            <span class="dispute-tx-label">Date</span>
            <span class="dispute-tx-value">{{ formatDateShort(dispute.transaction.created_at) }}</span>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-border">
          <router-link
            :to="{ name: 'transaction-detail', params: { id: dispute.transaction.id } }"
            class="btn btn-ghost btn-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View transaction
          </router-link>
        </div>
      </div>

      <!-- Raised by -->
      <div v-if="dispute.raised_by" class="card p-6">
        <h3 class="text-lg font-semibold text-text-1 mb-4">Raised By</h3>
        <div class="dispute-party">
          <div class="dispute-avatar">
            {{ getInitials(dispute.raised_by.name) }}
          </div>
          <div>
            <p class="font-semibold text-text-1">{{ dispute.raised_by.name }}</p>
            <p class="text-sm text-text-3">{{ dispute.raised_by.email }}</p>
          </div>
        </div>
      </div>

      <!-- Back link -->
      <div>
        <router-link :to="{ name: 'disputes' }" class="btn btn-ghost btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to disputes
        </router-link>
      </div>

    </template>

    <!-- Not found -->
    <div v-else class="card p-6">
      <div class="empty-state">
        <p class="text-lg font-semibold text-text-2">Dispute not found</p>
        <router-link :to="{ name: 'disputes' }" class="btn btn-secondary btn-sm">
          Back to disputes
        </router-link>
      </div>
    </div>

  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDisputeStore } from '@/stores/useDisputeStore'
import Badge from '@/components/ui/Badge.vue'
import { formatDate, formatDateShort, formatPrice, getInitials } from '@/utils/formatters'
import {
  DISPUTE_STATUS_LABELS,
  DISPUTE_STATUS_VARIANTS,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_VARIANTS,
} from '@/utils/constants'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const disputeStore = useDisputeStore()

const dispute = computed(() => disputeStore.dispute)

const statusLabel = computed(() => DISPUTE_STATUS_LABELS[dispute.value?.status] || dispute.value?.status)
const statusVariant = computed(() => DISPUTE_STATUS_VARIANTS[dispute.value?.status] || 'info')

const txStatusLabel = computed(() => TRANSACTION_STATUS_LABELS[dispute.value?.transaction?.status] || '')
const txStatusVariant = computed(() => TRANSACTION_STATUS_VARIANTS[dispute.value?.transaction?.status] || 'info')

onMounted(async () => {
  await disputeStore.fetchDispute(props.id || route.params.id)
})
</script>

<style scoped>
.dispute-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.dispute-detail-reason {
  margin-top: var(--spacing-5);
  padding-top: var(--spacing-5);
  border-top: 1px solid var(--color-border);
}

.dispute-detail-reason-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-3);
  margin-bottom: var(--spacing-2);
}

.dispute-detail-reason-text {
  font-size: var(--font-size-base);
  color: var(--color-text-2);
  line-height: var(--line-height-relaxed);
}

/* Notice cards */
.resolution-card,
.closed-card,
.open-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-5) var(--spacing-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(34, 34, 44, 0.6);
  backdrop-filter: blur(8px);
}

.resolution-card svg,
.closed-card svg,
.open-card svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.resolution-icon {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background-color: var(--color-success-ghost);
  color: var(--color-success);
  display: flex;
  align-items: center;
  justify-content: center;
}

.resolution-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.resolution-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-2);
  line-height: var(--line-height-relaxed);
}

.resolution-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: var(--spacing-2);
}

.closed-card { color: var(--color-text-3); }
.closed-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-2);
}
.closed-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-3);
  margin-top: var(--spacing-1);
}

.open-card { color: var(--color-warning); }
.open-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-warning);
}
.open-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-relaxed);
}

/* Transaction grid */
.dispute-tx-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
}

@media (max-width: 640px) {
  .dispute-tx-grid {
    grid-template-columns: 1fr;
  }
}

.dispute-tx-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.dispute-tx-label {
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-3);
}

.dispute-tx-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-1);
}

.dispute-party {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.dispute-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
  flex-shrink: 0;
}
</style>
