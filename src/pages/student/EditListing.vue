<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Edit listing</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Update your listing</h1>
      <p class="mt-3 text-lg text-text-2">
        Adjust the details of this listing and keep it current.
      </p>
    </div>

    <div v-if="loading" class="card p-6">
      <div class="skeleton h-8 w-1/3 rounded" />
    </div>

    <div v-else-if="listing" class="card p-6">
      <ListingForm
        :initial-data="listing"
        :is-edit="true"
        @submitted="handleSubmitted"
        @cancel="goBack"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useListingStore } from '@/stores/useListingStore'
import ListingForm from '@/components/listings/ListingForm.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const router = useRouter()
const listingStore = useListingStore()
const loading = ref(true)

onMounted(async () => {
  await listingStore.fetchListing(props.id || route.params.id)
  loading.value = false
})

const listing = computed(() => listingStore.listing)

const handleSubmitted = () => {
  router.push({ name: 'my-listings' })
}

const goBack = () => {
  router.back()
}
</script>
