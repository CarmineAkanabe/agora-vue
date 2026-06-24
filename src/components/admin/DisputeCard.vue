<template>
  <div class="card p-5 hover:border-text-3 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex items-start gap-4">
      <div class="h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-bold" 
           :class="statusColorClass">
        <svg v-if="dispute.status === 'resolved'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <svg v-else-if="dispute.status === 'closed'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-medium text-text-1">Dispute #{{ dispute.id }}</h3>
          <Badge :variant="statusVariant(dispute.status)">{{ statusLabel(dispute.status) }}</Badge>
        </div>
        <p class="text-sm text-text-2 mt-1 truncate max-w-xl">{{ dispute.reason }}</p>
        <div class="flex items-center gap-2 mt-2 text-xs text-text-3">
          <span>Raised by: <strong class="text-text-2">{{ dispute.raised_by?.name || 'Unknown' }}</strong></span>
          <span>•</span>
          <span>Transaction #{{ dispute.transaction_id }}</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:items-end gap-2 text-sm text-text-3 shrink-0">
      <span>Opened {{ formatRelative(dispute.created_at) }}</span>
      <router-link :to="{ name: 'admin-dispute-detail', params: { id: dispute.id } }" class="btn btn-secondary btn-sm mt-1">
        Manage Dispute
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRelative } from '@/utils/formatters'
import Badge from '@/components/ui/Badge.vue'
import { DISPUTE_STATUS_LABELS, DISPUTE_STATUS_VARIANTS } from '@/utils/constants'

const props = defineProps({
  dispute: {
    type: Object,
    required: true
  }
})

const statusLabel = (status) => DISPUTE_STATUS_LABELS[status] || status
const statusVariant = (status) => DISPUTE_STATUS_VARIANTS[status] || 'info'

const statusColorClass = computed(() => {
  if (props.dispute.status === 'resolved') return 'bg-success-ghost text-success'
  if (props.dispute.status === 'closed') return 'bg-surface-3 text-text-3'
  return 'bg-warning-ghost text-warning' // open
})
</script>
