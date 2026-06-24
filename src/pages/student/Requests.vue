<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Requests</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Manage Requests</h1>
      <p class="mt-3 text-lg text-text-2">Track the purchase requests you've sent and received.</p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-4 border-b border-border pb-2">
      <button 
        class="pb-2 font-semibold transition-colors"
        :class="activeTab === 'sent' ? 'text-primary border-b-2 border-primary' : 'text-text-3 hover:text-text-2'"
        @click="activeTab = 'sent'"
      >
        Sent Requests ({{ requestStore.sentRequests.length }})
      </button>
      <button 
        class="pb-2 font-semibold transition-colors"
        :class="activeTab === 'received' ? 'text-primary border-b-2 border-primary' : 'text-text-3 hover:text-text-2'"
        @click="activeTab = 'received'"
      >
        Received Requests ({{ requestStore.receivedRequests.length }})
      </button>
    </div>

    <div v-if="requestStore.loading" class="card p-6 space-y-3">
      <div class="skeleton h-8 w-1/3 rounded" />
      <div class="skeleton h-20 rounded-xl" />
    </div>

    <div v-else>
      <!-- Sent Tab -->
      <div v-if="activeTab === 'sent'" class="space-y-4">
        <div v-if="requestStore.sentRequests.length" class="space-y-4">
          <RequestCard
            v-for="request in requestStore.sentRequests"
            :key="request.id"
            :request="request"
            @cancel="handleCancel"
          />
        </div>
        <div v-else class="card p-6 text-text-2">You have not sent any requests yet.</div>
      </div>

      <!-- Received Tab -->
      <div v-else-if="activeTab === 'received'" class="space-y-4">
        <div v-if="requestStore.receivedRequests.length" class="space-y-4">
          <RequestCard
            v-for="request in requestStore.receivedRequests"
            :key="request.id"
            :request="request"
          />
        </div>
        <div v-else class="card p-6 text-text-2">No requests have arrived for your listings yet.</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRequestStore } from '@/stores/useRequestStore'
import RequestCard from '@/components/requests/RequestCard.vue'

const requestStore = useRequestStore()
const activeTab = ref('sent')

onMounted(async () => {
  await requestStore.fetchSentRequests()
  await requestStore.fetchReceivedRequests()
})

const handleCancel = async (id) => {
  await requestStore.cancelRequest(id)
}
</script>
