<template>
  <div class="card p-5 hover:border-text-3 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <div class="h-12 w-12 rounded-full bg-surface-3 flex items-center justify-center shrink-0 text-text-1 font-bold">
        {{ getInitials(verification.user?.name || 'User') }}
      </div>
      <div>
        <h3 class="text-lg font-medium text-text-1">{{ verification.user?.name || 'Unknown User' }}</h3>
        <p class="text-sm text-text-2 mt-1">{{ verification.university_email || verification.user?.email || 'No email provided' }}</p>
      </div>
    </div>
    <div class="flex flex-col md:items-end gap-2 text-sm text-text-3">
      <span>Submitted {{ formatRelative(verification.created_at) }}</span>
      <router-link :to="{ name: 'admin-verification-detail', params: { id: verification.id || verification.user?.id || 'unknown' } }" class="btn btn-secondary btn-sm mt-1">
        Review Request
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { formatRelative, getInitials } from '@/utils/formatters'

defineProps({
  verification: {
    type: Object,
    required: true
  }
})
</script>
