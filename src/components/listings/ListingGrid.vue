<template>
  <div v-if="loading" class="grid gap-5 md:grid-cols-2">
    <div v-for="item in 6" :key="item" class="card h-44 skeleton" />
  </div>

  <div v-else-if="listings.length === 0" class="card py-12 text-center">
    <h3 class="text-xl font-semibold text-text-1">No listings found</h3>
    <p class="mt-2 text-text-2">Try adjusting the filters or check back soon.</p>
  </div>

  <div v-else class="grid gap-5 md:grid-cols-2">
    <ListingCard v-for="listing in listings" :key="listing.id" :listing="listing" />
  </div>
</template>

<script setup>
import ListingCard from '@/components/listings/ListingCard.vue'

defineProps({
  listings: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
})
</script>


