<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Manage Dispute</h1>
        <p class="mt-2 text-lg text-text-2">
          Review the dispute details and issue a resolution.
        </p>
      </div>
      <div>
        <router-link :to="{ name: 'admin-disputes' }" class="btn btn-ghost btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to list
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading && !dispute">
      <div class="card p-8">
        <div class="skeleton h-8 w-1/3 rounded mb-6" />
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <div class="skeleton h-6 w-full rounded" />
            <div class="skeleton h-6 w-3/4 rounded" />
            <div class="skeleton h-32 w-full rounded mt-4" />
          </div>
          <div class="skeleton h-64 rounded-xl" />
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="dispute">
      <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        <!-- Left: Details -->
        <div class="space-y-6">
          <div class="card p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-text-1">Dispute Information</h2>
              <Badge :variant="statusVariant(dispute.status)">{{ statusLabel(dispute.status) }}</Badge>
            </div>
            
            <div class="bg-surface-3 p-4 rounded-xl border border-border mb-6">
              <p class="text-xs uppercase tracking-wider text-text-3 mb-2">Reason</p>
              <p class="text-text-1 whitespace-pre-wrap">{{ dispute.reason }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 pb-4 border-b border-border">
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Dispute ID</p>
                <p class="font-medium text-text-1">#{{ dispute.id }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Opened On</p>
                <p class="font-medium text-text-1">{{ formatDate(dispute.created_at) }}</p>
              </div>
            </div>

            <div v-if="dispute.resolution" class="mt-6">
              <h3 class="text-lg font-medium text-text-1 mb-2">Resolution</h3>
              <div class="bg-success-ghost/20 p-4 rounded-xl border border-success/30 text-text-1 whitespace-pre-wrap">
                {{ dispute.resolution }}
              </div>
            </div>
          </div>

          <div class="card p-6">
            <h2 class="text-xl font-semibold text-text-1 mb-4">Involved Parties</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="flex items-start gap-3">
                <div class="h-10 w-10 rounded-full bg-surface-3 flex items-center justify-center shrink-0 text-text-1 font-bold">
                  {{ getInitials(dispute.raised_by?.name || 'R') }}
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Raised By</p>
                  <p class="font-medium text-text-1">{{ dispute.raised_by?.name || 'Unknown' }}</p>
                  <p class="text-xs text-text-2">{{ dispute.raised_by?.email }}</p>
                </div>
              </div>
              <!-- In a real app we might also show the 'raised_against' user, assuming it's available via transaction -->
            </div>
          </div>
        </div>

        <!-- Right: Actions & Context -->
        <div class="space-y-6">
          <div class="card p-6">
            <h2 class="text-xl font-semibold text-text-1 mb-4">Transaction Context</h2>
            <div class="space-y-4" v-if="dispute.transaction">
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Transaction ID</p>
                <p class="font-medium text-text-1">#{{ dispute.transaction.id }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Transaction Status</p>
                <p class="font-medium text-text-1 uppercase text-xs">{{ dispute.transaction.status }}</p>
              </div>
              
              <div v-if="dispute.transaction.listing" class="p-4 bg-surface-3 rounded-lg border border-border">
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Listing</p>
                <p class="font-medium text-text-1">{{ dispute.transaction.listing.title }}</p>
                <p class="text-sm text-text-2 mt-1">{{ formatPrice(dispute.transaction.listing.price) }}</p>
              </div>

              <div class="pt-4 border-t border-border grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Buyer</p>
                  <p class="font-medium text-text-1">{{ dispute.transaction.buyer?.name || 'Unknown' }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Seller</p>
                  <p class="font-medium text-text-1">{{ dispute.transaction.seller?.name || 'Unknown' }}</p>
                </div>
              </div>
            </div>
            <div class="space-y-4" v-else>
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Transaction ID</p>
                <p class="font-medium text-text-1">#{{ dispute.transaction_id }}</p>
              </div>
              <p class="text-sm text-text-3">Full transaction details were not eager-loaded.</p>
            </div>
          </div>

          <div class="card p-6">
            <h2 class="text-xl font-semibold text-text-1 mb-4">Admin Actions</h2>
            
            <template v-if="dispute.status === 'open'">
              <div class="space-y-3">
                <Button variant="success" class="w-full" @click="showResolveModal = true">
                  Resolve Dispute
                </Button>
                <Button variant="secondary" class="w-full" @click="showCloseModal = true">
                  Close (No Action)
                </Button>
              </div>
            </template>
            <template v-else>
              <div class="p-4 bg-surface-3 rounded-lg border border-border text-center text-sm text-text-2">
                This dispute has been {{ dispute.status }}. No further actions can be taken.
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="card p-12 text-center text-text-2">
        Dispute not found.
      </div>
    </template>

    <!-- Resolve Modal -->
    <Modal
      v-model="showResolveModal"
      title="Resolve Dispute"
      variant="success"
      show-actions
      confirm-label="Submit Resolution"
      :loading="isResolving"
      @confirm="handleResolve"
    >
      <p class="text-text-2 mb-4">
        Provide a resolution for this dispute. This will be visible to the involved parties.
      </p>
      <UiTextarea
        v-model="resolutionText"
        label="Resolution Details"
        placeholder="e.g., Refund issued to buyer due to unreceived item..."
        :rows="4"
        :error="errors.resolution?.[0]"
      />
    </Modal>

    <!-- Close Modal -->
    <Modal
      v-model="showCloseModal"
      title="Close Dispute"
      variant="danger"
      show-actions
      confirm-label="Close Dispute"
      :loading="isClosing"
      @confirm="handleClose"
    >
      <p class="text-text-2">
        Are you sure you want to close this dispute without issuing a resolution? It will be marked as closed.
      </p>
    </Modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatDate, getInitials } from '@/utils/formatters'
import { DISPUTE_STATUS_LABELS, DISPUTE_STATUS_VARIANTS } from '@/utils/constants'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import UiTextarea from '@/components/ui/Textarea.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const adminStore = useAdminStore()

const disputeId = computed(() => props.id || route.params.id)
const dispute = computed(() => adminStore.dispute)
const loading = computed(() => adminStore.loading)
const errors = computed(() => adminStore.errors)

const statusLabel = (status) => DISPUTE_STATUS_LABELS[status] || status
const statusVariant = (status) => DISPUTE_STATUS_VARIANTS[status] || 'info'

const showResolveModal = ref(false)
const isResolving = ref(false)
const resolutionText = ref('')

const showCloseModal = ref(false)
const isClosing = ref(false)

onMounted(() => {
  adminStore.fetchDispute(disputeId.value)
})

const handleResolve = async () => {
  isResolving.value = true
  try {
    await adminStore.resolveDispute(disputeId.value, resolutionText.value)
    showResolveModal.value = false
  } catch (error) {
    console.error('Failed to resolve', error)
  } finally {
    isResolving.value = false
  }
}

const handleClose = async () => {
  isClosing.value = true
  try {
    await adminStore.closeDispute(disputeId.value)
    showCloseModal.value = false
  } catch (error) {
    console.error('Failed to close', error)
  } finally {
    isClosing.value = false
  }
}
</script>
