<template>
  <div class="card p-5 hover:border-text-3 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
    <div class="flex items-start gap-4">
      <div class="h-12 w-12 rounded-full flex items-center justify-center shrink-0 font-bold"
           :class="user.is_banned ? 'bg-danger-ghost text-danger' : 'bg-surface-3 text-text-1'">
        {{ getInitials(user.name) }}
      </div>
      <div>
        <h3 class="text-lg font-medium text-text-1 flex items-center gap-2">
          {{ user.name }}
          <Badge v-if="user.role === 'admin'" variant="danger">Admin</Badge>
          <Badge v-if="user.is_banned" variant="danger">Banned</Badge>
          <Badge v-else-if="user.verification_status === 'verified'" variant="success">Verified</Badge>
        </h3>
        <p class="text-sm text-text-2 mt-1">{{ user.email }}</p>
      </div>
    </div>
    <div class="flex flex-col md:items-end gap-2 text-sm text-text-3">
      <span>Joined {{ formatDateShort(user.created_at) }}</span>
      <router-link :to="{ name: 'admin-user-detail', params: { id: user.id } }" class="btn btn-secondary btn-sm mt-1">
        Manage User
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { formatDateShort, getInitials } from '@/utils/formatters'
import Badge from '@/components/ui/Badge.vue'

defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>
