<template>
  <Modal
    v-model="isOpen"
    title="Send Purchase Request"
    variant="form"
    show-actions
    confirm-label="Submit Request"
    :loading="loading"
    @confirm="submit"
  >
    <div class="space-y-4">
      <p class="text-text-2 text-sm">
        You are requesting to purchase <strong class="text-text-1">{{ listing.title }}</strong> for {{ formatPrice(listing.price) }}.
      </p>
      
      <div class="input-wrapper">
        <label for="quantity" class="label">Quantity <span class="text-text-3 text-xs">(Max {{ listing.quantity }})</span></label>
        <input 
          id="quantity" 
          type="number" 
          class="input" 
          v-model="form.quantity" 
          min="1" 
          :max="listing.quantity" 
          required 
          :class="{ 'input-error': errors.quantity }" 
        />
        <span v-if="errors.quantity" class="error-message">{{ errors.quantity[0] }}</span>
      </div>

      <UiInput
        id="whatsapp_number"
        v-model="form.whatsapp_number"
        type="tel"
        label="WhatsApp Number"
        placeholder="e.g. 655000000"
        :error="errors.whatsapp_number"
        required
      />

      <UiInput
        id="meeting_location"
        v-model="form.meeting_location"
        label="Proposed Meeting Location"
        placeholder="e.g. Library Entrance, Block A"
        :error="errors.meeting_location"
        required
      />

      <UiTextarea
        v-model="form.message"
        label="Message to Seller"
        placeholder="Is this still available? Can we meet tomorrow?"
        :rows="3"
        :error="errors.message?.[0]"
      />

      <div v-if="errors.message && typeof errors.message === 'string'" class="p-3 bg-danger-ghost border border-danger/30 rounded-lg text-danger text-sm mt-2">
        {{ errors.message }}
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRequestStore } from '@/stores/useRequestStore'
import { formatPrice } from '@/utils/formatters'
import Modal from '@/components/ui/Modal.vue'
import UiInput from '@/components/ui/Input.vue'
import UiTextarea from '@/components/ui/Textarea.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  listing: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue', 'success'])

const isOpen = ref(props.modelValue)

watch(() => props.modelValue, (val) => { isOpen.value = val })
watch(isOpen, (val) => { emit('update:modelValue', val) })

const requestStore = useRequestStore()
const loading = ref(false)
const errors = ref({})

const form = reactive({
  quantity: 1,
  whatsapp_number: '',
  meeting_location: '',
  message: 'Hi, I am interested in this item.'
})

const submit = async () => {
  loading.value = true
  errors.value = {}
  
  try {
    await requestStore.storeRequest({
      listing_id: props.listing.id,
      ...form
    })
    isOpen.value = false
    emit('success')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      errors.value = { message: error.response?.data?.message || 'Failed to send request.' }
    }
  } finally {
    loading.value = false
  }
}
</script>
