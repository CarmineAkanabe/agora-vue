<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Request details</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Request overview</h1>
      <p class="mt-3 text-lg text-text-2">Review the request details and take the next action.</p>
    </div>

    <div v-if="requestStore.loading" class="card p-6">
      <div class="skeleton h-8 w-1/3 rounded" />
    </div>

    <div v-else-if="requestStore.request" class="card p-6 space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="text-2xl font-semibold text-text-1">
            {{ requestStore.request.listing?.title }}
          </h2>
          <p class="mt-2 text-text-2">{{ requestStore.request.message || 'No note provided.' }}</p>
        </div>
        <RequestStatusBadge :status="requestStore.request.status" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl border border-border bg-surface-3/60 p-4">
          <p class="text-sm text-text-3">Buyer</p>
          <p class="mt-1 font-semibold text-text-1">
            {{ requestStore.request.buyer?.name || '—' }}
          </p>
        </div>
        <div class="rounded-2xl border border-border bg-surface-3/60 p-4">
          <p class="text-sm text-text-3">Seller</p>
          <p class="mt-1 font-semibold text-text-1">
            {{ requestStore.request.seller?.name || '—' }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-if="requestStore.request.status === 'pending'"
          class="btn btn-primary btn-sm"
          @click="approve"
        >
          Approve
        </button>
        <button
          v-if="requestStore.request.status === 'approved' && isBuyer"
          class="btn btn-primary btn-sm"
          @click="showPaymentModal = true"
        >
          Make Payment
        </button>
        <button
          v-if="requestStore.request.status === 'pending'"
          class="btn btn-danger btn-sm"
          @click="reject"
        >
          Reject
        </button>
        <button
          v-if="['pending', 'approved'].includes(requestStore.request.status)"
          class="btn btn-ghost btn-sm"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </div>

    <!-- Payment Modal -->
    <MakePaymentModal 
      v-if="requestStore.request && isBuyer" 
      v-model="showPaymentModal" 
      :request="requestStore.request" 
    />
  </section>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRequestStore } from '@/stores/useRequestStore'
import { useAuthStore } from '@/stores/useAuthStore'
import RequestStatusBadge from '@/components/requests/RequestStatusBadge.vue'
import MakePaymentModal from '@/components/transactions/MakePaymentModal.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const requestStore = useRequestStore()
const auth = useAuthStore()

const isBuyer = computed(() => auth.user?.id === requestStore.request?.buyer?.id)
const showPaymentModal = ref(false)

onMounted(async () => {
  await requestStore.fetchRequest(props.id || route.params.id)
})

const approve = async () => {
  await requestStore.approveRequest(props.id || route.params.id)
}

const reject = async () => {
  await requestStore.rejectRequest(props.id || route.params.id)
}

const cancel = async () => {
  await requestStore.cancelRequest(props.id || route.params.id)
}
</script>
