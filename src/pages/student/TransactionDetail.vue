<template>
  <section class="container section space-y-6">

    <!-- Page header -->
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Transaction details</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Transaction overview</h1>
      <p class="mt-3 text-lg text-text-2">
        Inspect escrow progress and verify pickup codes when required.
      </p>
    </div>

    <!-- Loading -->
    <div v-if="transactionStore.loading && !tx" class="space-y-4">
      <div class="card p-6">
        <div class="skeleton h-8 w-2/5 rounded mb-4" />
        <div class="skeleton h-4 w-3/5 rounded mb-2" />
        <div class="skeleton h-4 w-1/3 rounded" />
      </div>
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="card p-6">
          <div class="skeleton h-6 w-1/2 rounded mb-4" />
          <div class="skeleton h-20 w-full rounded" />
        </div>
        <div class="card p-6">
          <div class="skeleton h-6 w-1/2 rounded mb-4" />
          <div class="skeleton h-20 w-full rounded" />
        </div>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card p-6">
      <div class="empty-state">
        <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <p class="text-lg font-semibold text-text-2">Could not load transaction</p>
        <p class="text-sm text-text-3">{{ error }}</p>
        <router-link :to="{ name: 'transactions' }" class="btn btn-secondary btn-sm">
          Back to transactions
        </router-link>
      </div>
    </div>

    <!-- Transaction content -->
    <template v-else-if="tx">

      <!-- Title + status + polling indicator -->
      <div class="card p-6">
        <div class="detail-header">
          <div class="detail-header-info">
            <h2 class="text-2xl font-semibold text-text-1">
              {{ tx.purchase_request?.listing?.title || 'Transaction' }}
            </h2>
            <p class="mt-2 text-text-2">
              {{ tx.purchase_request?.message || 'No details provided.' }}
            </p>
          </div>
          <div class="detail-header-status">
            <Badge :variant="statusVariant" :dot="tx.status === 'initiated'">
              {{ statusLabel }}
            </Badge>
            <span v-if="transactionStore.polling" class="polling-indicator">
              <span class="polling-dot"></span>
              Checking status…
            </span>
          </div>
        </div>

        <!-- Key details grid -->
        <div class="detail-grid">
          <div class="detail-field">
            <span class="detail-field-label">Amount</span>
            <span class="detail-field-value price">{{ formatPrice(tx.amount) }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Payment method</span>
            <span class="detail-field-value">{{ paymentMethodLabel }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Date</span>
            <span class="detail-field-value">{{ formatDate(tx.created_at) }}</span>
          </div>
          <div class="detail-field">
            <span class="detail-field-label">Meeting location</span>
            <span class="detail-field-value">
              {{ tx.purchase_request?.meeting_location || '—' }}
            </span>
          </div>
        </div>

        <!-- Listing link -->
        <div v-if="tx.purchase_request?.listing" class="detail-listing-link">
          <router-link
            :to="{ name: 'listing-detail', params: { id: tx.purchase_request.listing.id } }"
            class="btn btn-ghost btn-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            View listing
          </router-link>
        </div>
      </div>

      <!-- Buyer / Seller info -->
      <div class="grid gap-6 md:grid-cols-2">
        <div class="card p-6">
          <p class="text-xs uppercase tracking-widest text-text-3 mb-3">Buyer</p>
          <div class="party-info">
            <div class="party-avatar">
              {{ getInitials(tx.buyer?.name) }}
            </div>
            <div>
              <p class="font-semibold text-text-1">{{ tx.buyer?.name || '—' }}</p>
              <p class="text-sm text-text-3">{{ tx.buyer?.email || '—' }}</p>
              <p v-if="isBuyer" class="text-xs text-primary mt-1">You</p>
            </div>
          </div>
        </div>
        <div class="card p-6">
          <p class="text-xs uppercase tracking-widest text-text-3 mb-3">Seller</p>
          <div class="party-info">
            <div class="party-avatar">
              {{ getInitials(tx.seller?.name) }}
            </div>
            <div>
              <p class="font-semibold text-text-1">{{ tx.seller?.name || '—' }}</p>
              <p class="text-sm text-text-3">{{ tx.seller?.email || '—' }}</p>
              <p v-if="isSeller" class="text-xs text-primary mt-1">You</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main content: Timeline + Pickup/Escrow -->
      <div class="grid gap-6 lg:grid-cols-[1fr_1fr]">

        <!-- Left: Escrow + Timeline -->
        <div class="space-y-6">
          <EscrowStatus
            :status="tx.status"
            :payment-method="tx.payment_method"
            :auto-release-at="tx.auto_release_at"
          />

          <div class="card p-6">
            <h3 class="text-lg font-semibold text-text-1 mb-4">Transaction Timeline</h3>
            <TransactionTimeline
              :status="tx.status"
              :created-at="tx.created_at"
              :pickup-code-used-at="tx.pickup_code_used_at"
            />
          </div>
        </div>

        <!-- Right: Role-based pickup section -->
        <div class="space-y-6">

          <!-- Buyer: pickup code display -->
          <template v-if="isBuyer">
            <PickupCodeDisplay
              v-if="tx.status === 'held' || tx.pickup_code"
              :code="tx.pickup_code"
              :used-at="tx.pickup_code_used_at"
            />

            <!-- K-PAY processing notice for initiated -->
            <div v-if="tx.status === 'initiated'" class="kpay-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <div>
                <p class="kpay-notice-title">Payment is being processed</p>
                <p class="kpay-notice-description">
                  K-PAY is confirming your mobile money payment. This process typically takes
                  under a minute, but may take up to 10 minutes depending on your provider.
                  Do not close this page — the status will update automatically.
                </p>
              </div>
            </div>

            <!-- Leave a Review (if released) -->
            <ReviewForm
              v-if="tx.status === 'released'"
              :transaction-id="tx.id"
            />
          </template>

          <!-- Seller: pickup code form -->
          <template v-if="isSeller">
            <PickupCodeForm
              v-if="tx.status === 'held'"
              :transaction-id="tx.id"
              @verified="onCodeVerified"
            />

            <!-- Already verified message -->
            <div v-else-if="tx.status === 'released'" class="verified-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div>
                <p class="verified-notice-title">Pickup code verified</p>
                <p class="verified-notice-description">
                  The funds are being disbursed to your mobile money account.
                </p>
              </div>
            </div>

            <!-- Waiting for payment as seller -->
            <div v-else-if="tx.status === 'initiated'" class="waiting-notice">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <p class="waiting-notice-title">Awaiting payment confirmation</p>
                <p class="waiting-notice-description">
                  The buyer's payment is being processed. You will be notified once the funds
                  are held in escrow and you can proceed with the pickup.
                </p>
              </div>
            </div>
          </template>

          <!-- Dispute Action (if held) -->
          <div v-if="tx.status === 'held'" class="mt-6 pt-6 border-t border-border">
            <div class="flex flex-col gap-2">
              <p class="text-sm font-semibold text-text-1">Having issues?</p>
              <p class="text-sm text-text-2">
                If you cannot resolve an issue with the other party, you can raise a dispute to freeze the funds and request admin intervention.
              </p>
              <Button variant="danger" size="sm" class="self-start mt-2" @click="showDisputeModal = true">
                Raise Dispute
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Back link -->
      <div class="detail-back">
        <router-link :to="{ name: 'transactions' }" class="btn btn-ghost btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to transactions
        </router-link>
      </div>

    </template>

    <!-- Dispute Modal -->
    <Modal
      v-model="showDisputeModal"
      title="Raise a Dispute"
      variant="danger"
      show-actions
      confirm-label="Submit Dispute"
      :loading="submittingDispute"
      @confirm="submitDispute"
    >
      <p class="mb-4 text-sm text-text-2">
        Are you sure you want to raise a dispute? This will notify admins to review the transaction.
      </p>
      <UiTextarea
        v-model="disputeReason"
        label="Reason for dispute"
        placeholder="Please explain the issue in detail..."
        :error="disputeError"
        :rows="4"
      />
    </Modal>

  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDisputeStore } from '@/stores/useDisputeStore'
import { useRouter } from 'vue-router'
import Badge from '@/components/ui/Badge.vue'
import EscrowStatus from '@/components/transactions/EscrowStatus.vue'
import TransactionTimeline from '@/components/transactions/TransactionTimeline.vue'
import PickupCodeDisplay from '@/components/transactions/PickupCodeDisplay.vue'
import PickupCodeForm from '@/components/transactions/PickupCodeForm.vue'
import ReviewForm from '@/components/reviews/ReviewForm.vue'
import Modal from '@/components/ui/Modal.vue'
import Button from '@/components/ui/Button.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import { formatPrice, formatDate, getInitials } from '@/utils/formatters'
import {
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_VARIANTS,
  PAYMENT_METHOD_LABELS,
} from '@/utils/constants'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const router = useRouter()
const transactionStore = useTransactionStore()
const auth = useAuthStore()
const disputeStore = useDisputeStore()

const error = ref(null)

const tx = computed(() => transactionStore.transaction)

const transactionId = computed(() => props.id || route.params.id)

const isBuyer = computed(() => auth.user?.id === tx.value?.buyer?.id)
const isSeller = computed(() => auth.user?.id === tx.value?.seller?.id)

const statusLabel = computed(
  () => TRANSACTION_STATUS_LABELS[tx.value?.status] || tx.value?.status,
)
const statusVariant = computed(
  () => TRANSACTION_STATUS_VARIANTS[tx.value?.status] || 'info',
)
const paymentMethodLabel = computed(
  () => PAYMENT_METHOD_LABELS[tx.value?.payment_method] || tx.value?.payment_method || '—',
)

onMounted(async () => {
  try {
    await transactionStore.fetchTransaction(transactionId.value)

    // Start polling if transaction is still being processed
    if (transactionStore.transaction?.status === 'initiated') {
      transactionStore.startPolling(transactionId.value)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'The transaction could not be loaded.'
  }
})

onUnmounted(() => {
  transactionStore.stopPolling()
})

// Watch for status changes to stop polling
watch(
  () => tx.value?.status,
  (newStatus) => {
    if (newStatus && newStatus !== 'initiated') {
      transactionStore.stopPolling()
    }
  },
)

const onCodeVerified = () => {
  // Refresh transaction after code verification
  transactionStore.fetchTransaction(transactionId.value)
}

// Dispute Handling
const showDisputeModal = ref(false)
const disputeReason = ref('')
const submittingDispute = ref(false)
const disputeError = ref(null)

const submitDispute = async () => {
  if (!disputeReason.value.trim()) {
    disputeError.value = 'Reason is required.'
    return
  }

  submittingDispute.value = true
  disputeError.value = null

  try {
    const newDispute = await disputeStore.storeDispute({
      transaction_id: transactionId.value,
      reason: disputeReason.value,
    })
    showDisputeModal.value = false
    router.push({ name: 'dispute-detail', params: { id: newDispute.id } })
  } catch (err) {
    if (err.response?.status === 422) {
      disputeError.value = disputeStore.errors.reason?.[0] || 'Invalid input.'
    } else {
      disputeError.value = err.response?.data?.message || 'Failed to raise dispute.'
    }
  } finally {
    submittingDispute.value = false
  }
}
</script>

<style scoped>
.detail-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-4);
}

.detail-header-info {
  flex: 1;
  min-width: 0;
}

.detail-header-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-2);
}

.polling-indicator {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  font-size: var(--font-size-xs);
  color: var(--color-info);
}

.polling-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: var(--color-info);
  animation: poll-blink 1s ease-in-out infinite;
}

@keyframes poll-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-4);
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

.detail-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.detail-field-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.detail-field-value {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-1);
}

.detail-listing-link {
  margin-top: var(--spacing-4);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-border);
}

.party-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.party-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
  flex-shrink: 0;
}

/* Notice cards */
.kpay-notice,
.verified-notice,
.waiting-notice {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(34, 34, 44, 0.6);
  backdrop-filter: blur(8px);
}

.kpay-notice {
  color: var(--color-warning);
}

.kpay-notice svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.kpay-notice-title,
.verified-notice-title,
.waiting-notice-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.kpay-notice-title { color: var(--color-warning); }
.verified-notice-title { color: var(--color-success); }
.waiting-notice-title { color: var(--color-info); }

.kpay-notice-description,
.verified-notice-description,
.waiting-notice-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-relaxed);
}

.verified-notice {
  color: var(--color-success);
}

.verified-notice svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.waiting-notice {
  color: var(--color-info);
}

.waiting-notice svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.detail-back {
  padding-top: var(--spacing-2);
}
</style>
