<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <UiInput v-model="form.quantity" label="Quantity" type="number" min="1" required />
    <UiInput
      v-model="form.meeting_location"
      label="Meeting location"
      placeholder="Library entrance"
    />
    <UiInput v-model="form.whatsapp_number" label="WhatsApp number" placeholder="655000001" />
    <UiTextarea
      v-model="form.message"
      label="Message"
      placeholder="Tell the seller a bit about your interest"
    />

    <Button type="submit" :loading="submitting" :disabled="submitting"> Send request </Button>

    <p v-if="errorMessage" class="text-sm text-danger">{{ errorMessage }}</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import UiInput from '@/components/ui/Input.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import { useRequestStore } from '@/stores/useRequestStore'

const props = defineProps({ listingId: { type: [String, Number], required: true } })
const emit = defineEmits(['submitted'])
const requestStore = useRequestStore()
const submitting = ref(false)
const errorMessage = ref('')

const form = reactive({
  listing_id: Number(props.listingId),
  quantity: '1',
  meeting_location: '',
  whatsapp_number: '',
  message: '',
})

const handleSubmit = async () => {
  errorMessage.value = ''
  submitting.value = true
  try {
    await requestStore.storeRequest({ ...form, listing_id: Number(props.listingId) })
    emit('submitted')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Unable to send request.'
  } finally {
    submitting.value = false
  }
}
</script>
