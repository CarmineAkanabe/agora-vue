<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Review Verification</h1>
        <p class="mt-2 text-lg text-text-2">
          Verify the student's ID against their provided details.
        </p>
      </div>
      <div>
        <router-link :to="{ name: 'admin-verifications' }" class="btn btn-ghost btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to list
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading && !verification">
      <div class="card p-8">
        <div class="skeleton h-8 w-1/3 rounded mb-6" />
        <div class="grid md:grid-cols-2 gap-8">
          <div class="skeleton h-64 rounded-xl" />
          <div class="space-y-4">
            <div class="skeleton h-6 w-full rounded" />
            <div class="skeleton h-6 w-3/4 rounded" />
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="verification">
      <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        <!-- Left: ID Card Image -->
        <div class="card p-6 flex flex-col h-full">
          <h2 class="text-xl font-semibold text-text-1 mb-4">Student ID Card</h2>
          <div class="flex-1 bg-surface-3 rounded-xl border border-border overflow-hidden flex items-center justify-center min-h-[300px]">
            <img 
              v-if="verification.id_card_url || verification.id_card" 
              :src="verification.id_card_url || verification.id_card" 
              alt="Student ID" 
              class="w-full h-full object-contain"
            />
            <div v-else class="text-text-3 flex flex-col items-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mb-2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>No image provided</span>
            </div>
          </div>
        </div>

        <!-- Right: Details and Actions -->
        <div class="card p-6 flex flex-col h-full">
          <h2 class="text-xl font-semibold text-text-1 mb-4">Profile Details</h2>
          
          <div class="space-y-4 flex-1">
            <div class="pb-4 border-b border-border">
              <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Name</p>
              <p class="text-lg font-medium text-text-1">{{ verification.user?.name || 'N/A' }}</p>
            </div>
            <div class="pb-4 border-b border-border">
              <p class="text-xs uppercase tracking-wider text-text-3 mb-1">University Email</p>
              <p class="text-lg font-medium text-text-1">{{ verification.university_email || verification.user?.email || 'N/A' }}</p>
            </div>
            <div class="pb-4 border-b border-border">
              <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Submitted At</p>
              <p class="text-lg font-medium text-text-1">{{ formatDate(verification.created_at) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-8 flex flex-col gap-3">
            <Button variant="success" class="w-full" @click="showApproveModal = true">
              Approve Verification
            </Button>
            <Button variant="danger" class="w-full" @click="showRejectModal = true">
              Reject Verification
            </Button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="card p-12 text-center text-text-2">
        Verification request not found.
      </div>
    </template>

    <!-- Approve Modal -->
    <Modal
      v-model="showApproveModal"
      title="Approve Verification"
      variant="success"
      show-actions
      confirm-label="Approve"
      :loading="isApproving"
      @confirm="handleApprove"
    >
      <p class="text-text-2">
        Are you sure you want to approve this student's verification? This will grant them full access to buy and sell on the platform.
      </p>
    </Modal>

    <!-- Reject Modal -->
    <Modal
      v-model="showRejectModal"
      title="Reject Verification"
      variant="danger"
      show-actions
      confirm-label="Reject"
      :loading="isRejecting"
      @confirm="handleReject"
    >
      <p class="text-text-2 mb-4">
        Are you sure you want to reject this student's verification? Please provide a reason below.
      </p>
      <UiTextarea
        v-model="rejectReason"
        label="Reason for rejection (optional)"
        placeholder="e.g., ID is blurry, name does not match..."
        :rows="3"
      />
    </Modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatDate } from '@/utils/formatters'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import UiTextarea from '@/components/ui/Textarea.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const router = useRouter()
const adminStore = useAdminStore()

const verificationId = computed(() => props.id || route.params.id)
const verification = computed(() => adminStore.verification)
const loading = computed(() => adminStore.loading)

const showApproveModal = ref(false)
const isApproving = ref(false)

const showRejectModal = ref(false)
const isRejecting = ref(false)
const rejectReason = ref('')

onMounted(() => {
  adminStore.fetchVerification(verificationId.value)
})

const handleApprove = async () => {
  isApproving.value = true
  try {
    await adminStore.approveVerification(verificationId.value)
    showApproveModal.value = false
    router.push({ name: 'admin-verifications' })
  } catch (error) {
    console.error('Failed to approve', error)
  } finally {
    isApproving.value = false
  }
}

const handleReject = async () => {
  isRejecting.value = true
  try {
    await adminStore.rejectVerification(verificationId.value, rejectReason.value)
    showRejectModal.value = false
    router.push({ name: 'admin-verifications' })
  } catch (error) {
    console.error('Failed to reject', error)
  } finally {
    isRejecting.value = false
  }
}
</script>
