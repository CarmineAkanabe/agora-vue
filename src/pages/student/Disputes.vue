<template>
  <section class="container section space-y-6">

    <!-- Page header -->
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Disputes</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Your disputes</h1>
      <p class="mt-3 text-lg text-text-2">
        Track and manage disputes raised on your transactions.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="disputeStore.loading" class="space-y-4">
      <div class="card p-6">
        <div class="skeleton h-6 w-2/5 rounded mb-3" />
        <div class="skeleton h-4 w-3/5 rounded mb-2" />
        <div class="skeleton h-4 w-1/4 rounded" />
      </div>
      <div class="card p-6">
        <div class="skeleton h-6 w-1/3 rounded mb-3" />
        <div class="skeleton h-4 w-2/5 rounded mb-2" />
        <div class="skeleton h-4 w-1/5 rounded" />
      </div>
    </div>

    <!-- Dispute list -->
    <div v-else-if="disputeStore.disputes.length" class="space-y-4">
      <article
        v-for="dispute in sortedDisputes"
        :key="dispute.id"
        class="card dispute-card"
      >
        <div class="dispute-card-header">
          <div class="dispute-card-info">
            <div class="dispute-card-title-row">
              <h3 class="dispute-card-title">
                Dispute #{{ dispute.id }}
              </h3>
              <Badge :variant="statusVariant(dispute.status)">
                {{ statusLabel(dispute.status) }}
              </Badge>
            </div>
            <p class="dispute-card-reason">{{ dispute.reason }}</p>
            <p class="dispute-card-meta">
              Raised {{ formatRelative(dispute.created_at) }}
              <template v-if="dispute.transaction">
                · Transaction #{{ dispute.transaction.id }}
              </template>
            </p>
          </div>
        </div>

        <div class="dispute-card-footer">
          <router-link
            :to="{ name: 'dispute-detail', params: { id: dispute.id } }"
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
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state card">
      <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <p class="text-lg font-semibold text-text-2">No disputes</p>
      <p class="text-sm text-text-3">
        Disputes can be raised on transactions where funds are held in escrow.
      </p>
    </div>

  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useDisputeStore } from '@/stores/useDisputeStore'
import Badge from '@/components/ui/Badge.vue'
import { formatRelative } from '@/utils/formatters'
import { DISPUTE_STATUS_LABELS, DISPUTE_STATUS_VARIANTS } from '@/utils/constants'

const disputeStore = useDisputeStore()

onMounted(async () => {
  await disputeStore.fetchDisputes()
})

const sortedDisputes = computed(() => {
  return [...disputeStore.disputes].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )
})

const statusLabel = (status) => DISPUTE_STATUS_LABELS[status] || status
const statusVariant = (status) => DISPUTE_STATUS_VARIANTS[status] || 'info'
</script>

<style scoped>
.dispute-card {
  padding: var(--spacing-5) var(--spacing-6);
  transition: border-color var(--transition-fast);
}

.dispute-card:hover {
  border-color: var(--color-text-3);
}

.dispute-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.dispute-card-info {
  flex: 1;
  min-width: 0;
}

.dispute-card-title-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.dispute-card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.dispute-card-reason {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-2);
  line-height: var(--line-height-relaxed);
}

.dispute-card-meta {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: var(--spacing-2);
}

.dispute-card-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}
</style>
