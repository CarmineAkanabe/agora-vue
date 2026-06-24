<template>
  <Modal
    v-model="isOpen"
    title="Initiate Payment"
    variant="form"
    show-actions
    confirm-label="Make Payment"
    :loading="loading"
    @confirm="submit"
  >
    <form class="payment-form" @submit.prevent="submit">
      <div class="payment-summary">
        <span class="summary-label">Escrow payment</span>
        <strong>{{ formatPrice(request.listing?.price) }}</strong>
        <p>
          Payment for <span>{{ request.listing?.title }}</span> will be held securely until pickup is confirmed.
        </p>
      </div>

      <div class="input-wrapper">
        <label class="label">Payment Provider</label>
        <div class="provider-grid" role="radiogroup" aria-label="Payment Provider">
          <button
            v-for="provider in providers"
            :key="provider.value"
            type="button"
            :class="['provider-option', { active: form.payment_method === provider.value }]"
            role="radio"
            :aria-checked="form.payment_method === provider.value"
            @click="form.payment_method = provider.value"
          >
            <img :src="provider.logo" :alt="provider.name" />
            <span>{{ provider.name }}</span>
          </button>
        </div>
        <span v-if="errors.payment_method" class="error-message text-danger text-xs">
          {{ errors.payment_method[0] }}
        </span>
      </div>

      <div v-if="Object.keys(errors).length > 0" class="payment-errors">
        <p v-for="(errMsgs, key) in errors" :key="key">
          <strong>{{ key }}:</strong> {{ Array.isArray(errMsgs) ? errMsgs[0] : errMsgs }}
        </p>
      </div>

      <button type="submit" class="hidden"></button>
    </form>
  </Modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatPrice } from '@/utils/formatters'
import Modal from '@/components/ui/Modal.vue'
import { toast } from 'vue-sonner'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  request: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'success'])

const providers = [
  { value: 'mtn', name: 'MTN Mobile Money', logo: '/mtn-momo.svg' },
  { value: 'orange', name: 'Orange Money', logo: '/orange-money.svg' },
]

const isOpen = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
  },
)
watch(isOpen, (val) => {
  emit('update:modelValue', val)
})

const transactionStore = useTransactionStore()
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)
const errors = ref({})

const form = reactive({
  payment_method: '',
})

const submit = async () => {
  if (!form.payment_method) {
    errors.value = { payment_method: ['Please select a payment provider.'] }
    return
  }

  loading.value = true
  errors.value = {}

  try {
    const tx = await transactionStore.initiatePayment({
      purchase_request_id: props.request.id,
      payment_method: form.payment_method,
      buyer_phone: authStore.user?.profile?.phone || '',
    })

    const txId = tx?.id || tx?.transaction?.id || tx?.data?.id

    isOpen.value = false
    emit('success', tx)
    toast.success('Payment initiated!')

    if (txId) {
      router.push({ name: 'transaction-detail', params: { id: txId } })
    } else {
      router.push({ name: 'transactions' })
    }
  } catch (error) {
    console.error('Payment Submission Error:', error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      isOpen.value = false
      router.push({
        name: 'error',
        query: {
          title: 'Payment Failed',
          message:
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred while initiating your payment.',
        },
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.payment-form {
  display: grid;
  gap: var(--spacing-5);
}

.payment-summary {
  padding: var(--spacing-5);
  border: 1px solid rgba(45, 212, 191, 0.2);
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(251, 191, 36, 0.07));
}

.summary-label {
  display: block;
  margin-bottom: var(--spacing-2);
  color: var(--color-text-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.payment-summary strong {
  display: block;
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: var(--font-size-2xl);
}

.payment-summary p {
  margin-top: var(--spacing-2);
  font-size: var(--font-size-sm);
}

.payment-summary span {
  color: var(--color-text-1);
  font-weight: var(--font-weight-semibold);
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--spacing-3);
}

.provider-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  min-height: 76px;
  padding: var(--spacing-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-3);
  color: var(--color-text-2);
  cursor: pointer;
  text-align: left;
  transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.provider-option:hover,
.provider-option.active {
  transform: translateY(-2px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-glow-primary);
  color: var(--color-text-1);
}

.provider-option img {
  width: 56px;
  height: 36px;
  object-fit: contain;
  border-radius: var(--radius-sm);
}

.provider-option span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
}

.payment-errors {
  padding: var(--spacing-3);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius-md);
  background: var(--color-danger-ghost);
  color: var(--color-danger);
  font-size: var(--font-size-sm);
}

@media (max-width: 520px) {
  .provider-grid {
    grid-template-columns: 1fr;
  }
}
</style>
