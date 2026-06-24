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
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-text-2 text-sm">
        You are about to make a payment for <strong class="text-text-1">{{ request.listing?.title }}</strong>.
        The amount is {{ formatPrice(request.listing?.price) }}.
      </p>
      
      <div class="input-wrapper">
        <label for="payment_method" class="label">Payment Provider</label>
        <select 
          id="payment_method" 
          v-model="form.payment_method" 
          class="input bg-surface-2 border-border text-text-1 w-full p-2 rounded" 
          required
        >
          <option value="" disabled>Select Provider</option>
          <option value="mtn">MTN Mobile Money</option>
          <option value="orange">Orange Money</option>
        </select>
        <span v-if="errors.payment_method" class="error-message text-danger text-xs">{{ errors.payment_method[0] }}</span>
      </div>

      <div v-if="Object.keys(errors).length > 0" class="p-3 bg-danger-ghost border border-danger/30 rounded-lg text-danger text-sm mt-2">
        <p v-for="(errMsgs, key) in errors" :key="key">
          <strong>{{ key }}:</strong> {{ Array.isArray(errMsgs) ? errMsgs[0] : errMsgs }}
        </p>
      </div>
      
      <!-- Hidden submit button to allow Enter key submission -->
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
  request: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue', 'success'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => { isOpen.value = val })
watch(isOpen, (val) => { emit('update:modelValue', val) })

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
      buyer_phone: authStore.user?.profile?.phone || ''
    })
    
    // Some APIs wrap the object in 'transaction' or 'data'
    const txId = tx?.id || tx?.transaction?.id || tx?.data?.id
    
    isOpen.value = false
    emit('success', tx)
    toast.success('Payment initiated!')
    
    if (txId) {
      router.push({ name: 'transaction-detail', params: { id: txId } })
    } else {
      router.push({ name: 'transactions' }) // Fallback
    }
  } catch (error) {
    console.error("Payment Submission Error:", error)
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      isOpen.value = false
      router.push({ 
        name: 'error', 
        query: { 
          title: 'Payment Failed',
          message: error.response?.data?.message || error.message || 'An unexpected error occurred while initiating your payment.' 
        } 
      })
    }
  } finally {
    loading.value = false
  }
}
</script>
