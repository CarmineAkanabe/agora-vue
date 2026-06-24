<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Requests</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Sent requests</h1>
      <p class="mt-3 text-lg text-text-2">Track the purchase requests you've sent to sellers.</p>
    </div>

    <div v-if="loading" class="card p-6 space-y-3">
      <div class="skeleton h-8 w-1/3 rounded" />
      <div class="skeleton h-20 rounded-xl" />
    </div>

    <div v-else-if="requestStore.sentRequests.length" class="space-y-4">
      <RequestCard
        v-for="request in requestStore.sentRequests"
        :key="request.id"
        :request="request"
        @cancel="handleCancel"
      />
    </div>

    <div v-else class="card p-6 text-text-2">You have not sent any requests yet.</div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRequestStore } from '@/stores/useRequestStore'
import RequestCard from '@/components/requests/RequestCard.vue'

const requestStore = useRequestStore()

onMounted(async () => {
  await requestStore.fetchSentRequests()
})

const handleCancel = async (id) => {
  await requestStore.cancelRequest(id)
}
</script>
