<template>
  <div class="pickup-form-card">
    <div class="pickup-form-header">
      <div class="pickup-form-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
      <div>
        <p class="pickup-form-label">Verify Pickup Code</p>
        <p class="pickup-form-hint">Enter the 6-digit code shown by the buyer to release funds</p>
      </div>
    </div>

    <!-- Success state -->
    <div v-if="verified" class="pickup-form-success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <div>
        <p class="pickup-form-success-title">Code verified successfully</p>
        <p class="pickup-form-success-description">
          The funds are being disbursed to your account. You will receive a notification once complete.
        </p>
      </div>
    </div>

    <!-- Form -->
    <form v-else class="pickup-form" @submit.prevent="handleSubmit">
      <div class="pickup-form-input-row">
        <UiInput
          v-model="code"
          label=""
          placeholder="000000"
          :error="errorMessage"
          :disabled="submitting"
          maxlength="6"
          inputmode="numeric"
          pattern="[0-9]*"
          autocomplete="one-time-code"
        />
        <Button
          type="submit"
          :loading="submitting"
          :disabled="submitting || code.length !== 6"
        >
          Verify
        </Button>
      </div>
      <p v-if="serverError" class="pickup-form-server-error">{{ serverError }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { useTransactionStore } from '@/stores/useTransactionStore'
import { pickupCode as validatePickupCode } from '@/utils/validators'

const props = defineProps({ transactionId: { type: [String, Number], required: true } })
const emit = defineEmits(['verified'])

const transactionStore = useTransactionStore()

const code = ref('')
const submitting = ref(false)
const verified = ref(false)
const serverError = ref('')

const errorMessage = computed(() => {
  if (!code.value) return null
  const result = validatePickupCode(code.value)
  return result === true ? null : result
})

const handleSubmit = async () => {
  // Client-side validation
  const validation = validatePickupCode(code.value)
  if (validation !== true) return

  submitting.value = true
  serverError.value = ''

  try {
    const result = await transactionStore.verifyPickupCode(props.transactionId, code.value)
    verified.value = true
    emit('verified', result)
  } catch (error) {
    const data = error.response?.data
    if (data?.errors?.code) {
      serverError.value = data.errors.code[0]
    } else {
      serverError.value = data?.message || 'Unable to verify pickup code. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.pickup-form-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(34, 34, 44, 0.6);
  backdrop-filter: blur(8px);
  padding: var(--spacing-5) var(--spacing-6);
}

.pickup-form-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-5);
}

.pickup-form-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-ghost);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pickup-form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.pickup-form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: 2px;
}

.pickup-form-input-row {
  display: flex;
  gap: var(--spacing-3);
  align-items: flex-start;
}

.pickup-form-input-row .input-wrapper {
  flex: 1;
}

.pickup-form-server-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  margin-top: var(--spacing-2);
}

.pickup-form-success {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--radius-base);
  background-color: var(--color-success-ghost);
  color: var(--color-success);
}

.pickup-form-success svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.pickup-form-success-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.pickup-form-success-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-relaxed);
}
</style>
