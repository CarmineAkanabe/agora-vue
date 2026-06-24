<template>
  <article class="card listing-card space-y-3">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-semibold text-text-1">{{ listing.title }}</h3>
        <p class="text-sm text-text-2">{{ listing.category?.name || 'General' }}</p>
      </div>
      <span class="text-sm font-semibold text-accent">{{ formatPrice(listing.price) }}</span>
    </div>

    <div class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-3">
      <span class="rounded-full border border-border bg-surface-3/70 px-2.5 py-1">{{
        displayCondition
      }}</span>
      <span
        v-if="listing.quantity !== undefined"
        class="rounded-full border border-border bg-surface-3/70 px-2.5 py-1"
      >
        Qty {{ listing.quantity }}
      </span>
    </div>

    <p class="text-sm text-text-2 line-clamp-3">
      {{ listing.description || 'No description provided yet.' }}
    </p>

    <div class="flex items-center justify-between text-sm text-text-3">
      <span>{{ listing.seller?.name || 'Student seller' }}</span>
      <router-link
        :to="{ name: 'listing-detail', params: { id: listing.id } }"
        class="text-primary"
      >
        View details
      </router-link>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils/formatters'

const props = defineProps({
  listing: { type: Object, default: () => ({}) },
})

const displayCondition = computed(() => {
  const value = props.listing.condition
  if (!value) return 'General'
  return value.replace(/_/g, ' ')
})
</script>

<style scoped>
.listing-card {
  min-height: 220px;
}

.listing-card h3 {
  line-height: var(--line-height-snug);
}
</style>

