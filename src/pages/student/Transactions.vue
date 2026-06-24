<template>
  <section class="container section space-y-6">

    <!-- Page header -->
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Transactions</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Your transactions</h1>
      <p class="mt-3 text-lg text-text-2">
        Track escrow payments, pickup verifications, and completed deals.
      </p>
    </div>

    <!-- Summary stats -->
    <div v-if="!transactionStore.loading && transactionStore.transactions.length" class="transactions-stats">
      <div class="stat-card">
        <p class="stat-value">{{ totalCount }}</p>
        <p class="stat-label">Total</p>
      </div>
      <div class="stat-card stat-held">
        <p class="stat-value">{{ heldCount }}</p>
        <p class="stat-label">In Escrow</p>
      </div>
      <div class="stat-card stat-completed">
        <p class="stat-value">{{ completedCount }}</p>
        <p class="stat-label">Completed</p>
      </div>
      <div class="stat-card stat-processing">
        <p class="stat-value">{{ processingCount }}</p>
        <p class="stat-label">Processing</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="transactionStore.loading" class="space-y-4">
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
      <div class="card p-6">
        <div class="skeleton h-6 w-2/6 rounded mb-3" />
        <div class="skeleton h-4 w-1/2 rounded mb-2" />
        <div class="skeleton h-4 w-1/6 rounded" />
      </div>
    </div>

    <!-- Transaction list -->
    <div v-else-if="sortedTransactions.length" class="space-y-4">
      <TransactionCard
        v-for="transaction in sortedTransactions"
        :key="transaction.id"
        :transaction="transaction"
      />
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state card">
      <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
      <p class="text-lg font-semibold text-text-2">No transactions yet</p>
      <p class="text-sm text-text-3">
        Transactions appear here once a payment is initiated for an approved purchase request.
      </p>
      <router-link :to="{ name: 'browse' }" class="btn btn-secondary btn-sm">
        Browse listings
      </router-link>
    </div>

  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import TransactionCard from '@/components/transactions/TransactionCard.vue'

const transactionStore = useTransactionStore()

onMounted(async () => {
  await transactionStore.fetchTransactions()
})

// Sort by date descending (newest first)
const sortedTransactions = computed(() => {
  return [...transactionStore.transactions].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  )
})

const totalCount = computed(() => transactionStore.transactions.length)

const heldCount = computed(
  () => transactionStore.transactions.filter((t) => t.status === 'held').length,
)

const completedCount = computed(
  () => transactionStore.transactions.filter((t) => t.status === 'released').length,
)

const processingCount = computed(
  () => transactionStore.transactions.filter((t) => t.status === 'initiated').length,
)
</script>

<style scoped>
.transactions-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-4);
}

@media (max-width: 640px) {
  .transactions-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-4) var(--spacing-5);
  text-align: center;
  transition: border-color var(--transition-fast);
}

.stat-card:hover {
  border-color: var(--color-text-3);
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: var(--spacing-1);
}

.stat-held .stat-value {
  color: var(--color-warning);
}

.stat-completed .stat-value {
  color: var(--color-success);
}

.stat-processing .stat-value {
  color: var(--color-info);
}
</style>
