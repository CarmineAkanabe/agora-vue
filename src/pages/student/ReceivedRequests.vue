<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Requests</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Received requests</h1>
      <p class="mt-3 text-lg text-text-2">Review and respond to purchase requests from buyers.</p>
    </div>

    <div v-if="requestStore.loading" class="card p-6 space-y-3">
      <div class="skeleton h-8 w-1/3 rounded" />
      <div class="skeleton h-20 rounded-xl" />
    </div>

    <div v-else-if="requestStore.receivedRequests.length" class="space-y-4">
      <RequestCard
        v-for="request in requestStore.receivedRequests"
        :key="request.id"
        :request="request"
      />
    </div>

    <div v-else class="card p-6 text-text-2">No requests have arrived for your listings yet.</div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRequestStore } from '@/stores/useRequestStore'
import RequestCard from '@/components/requests/RequestCard.vue'

const requestStore = useRequestStore()

onMounted(async () => {
  await requestStore.fetchReceivedRequests()
})
</script>
