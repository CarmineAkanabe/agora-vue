<template>
  <article class="card p-6">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-lg font-semibold text-text-1">
            {{ request.listing?.title || 'Listing request' }}
          </h3>
          <RequestStatusBadge :status="request.status" />
        </div>
        <p class="mt-2 text-sm text-text-2">
          {{ request.message || 'No note provided.' }}
        </p>
      </div>
      <div class="text-sm text-text-3">
        <p>{{ request.listing?.price ? formatPrice(request.listing.price) : '—' }}</p>
        <p class="mt-1">{{ request.created_at ? formatDateShort(request.created_at) : '—' }}</p>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap gap-2">
      <router-link
        :to="{ name: 'request-detail', params: { id: request.id } }"
        class="btn btn-secondary btn-sm"
      >
        View details
      </router-link>
      <button
        v-if="request.status === 'pending'"
        class="btn btn-danger btn-sm"
        @click="$emit('cancel', request.id)"
      >
        Cancel
      </button>
    </div>
  </article>
</template>

<script setup>
import RequestStatusBadge from '@/components/requests/RequestStatusBadge.vue'
import { formatDateShort, formatPrice } from '@/utils/formatters'

defineProps({ request: { type: Object, required: true } })
defineEmits(['cancel'])
</script>
