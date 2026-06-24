<template>
  <div class="card p-0 overflow-hidden flex flex-col h-full">
    <div class="p-5 border-b border-border bg-surface-3/30 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-1">Recent Transactions</h2>
      <router-link :to="{ name: 'transactions' }" class="text-sm font-medium text-primary hover:text-primary-dim transition-colors">
        View all
      </router-link>
    </div>

    <div class="flex-1 overflow-x-auto">
      <template v-if="loading">
        <div class="p-5 space-y-4">
          <div v-for="i in 3" :key="i" class="flex justify-between items-center">
            <div class="skeleton h-5 w-1/3 rounded" />
            <div class="skeleton h-5 w-1/4 rounded" />
            <div class="skeleton h-6 w-16 rounded-full" />
          </div>
        </div>
      </template>
      
      <template v-else-if="!transactions || transactions.length === 0">
        <div class="empty-state py-10">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-3 mb-3">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9" />
          </svg>
          <p class="text-sm font-medium text-text-2">No recent transactions</p>
        </div>
      </template>

      <template v-else>
        <table class="w-full text-left border-collapse min-w-[400px]">
          <thead>
            <tr class="border-b border-border bg-surface-2 text-xs uppercase tracking-wider text-text-3">
              <th class="p-4 font-medium">Transaction</th>
              <th class="p-4 font-medium">Amount</th>
              <th class="p-4 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="tx in transactions" 
              :key="tx.id"
              class="border-b border-border last:border-0 hover:bg-surface-3/50 transition-colors cursor-pointer"
              @click="$router.push({ name: 'transaction-detail', params: { id: tx.id } })"
            >
              <td class="p-4">
                <p class="text-sm font-medium text-text-1 truncate max-w-[200px]">
                  {{ tx.listing?.title || `Transaction #${tx.id}` }}
                </p>
                <p class="text-xs text-text-3 mt-1">{{ formatDateShort(tx.created_at) }}</p>
              </td>
              <td class="p-4">
                <span class="text-sm font-semibold text-text-1">{{ formatPrice(tx.amount) }}</span>
              </td>
              <td class="p-4 text-right">
                <Badge :variant="statusVariant(tx.status)">
                  {{ statusLabel(tx.status) }}
                </Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </div>
  </div>
</template>

<script setup>
import Badge from '@/components/ui/Badge.vue'
import { formatPrice, formatDateShort } from '@/utils/formatters'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_STATUS_VARIANTS } from '@/utils/constants'

defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const statusLabel = (status) => TRANSACTION_STATUS_LABELS[status] || status
const statusVariant = (status) => TRANSACTION_STATUS_VARIANTS[status] || 'info'
</script>
