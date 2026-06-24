<template>
  <div class="rounded-2xl border p-4" :class="statusClass">
    <div class="flex items-start gap-3">
      <div class="mt-0.5 rounded-full p-2" :class="iconClass">
        <svg
          v-if="status === 'approved'"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <svg
          v-else-if="status === 'rejected'"
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <svg
          v-else
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div>
        <p class="font-semibold text-text-1">{{ label }}</p>
        <p class="mt-1 text-sm text-text-2">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'pending' },
})

const label = computed(() => {
  if (props.status === 'approved') return 'Verified account'
  if (props.status === 'rejected') return 'Verification rejected'
  return 'Verification pending'
})

const description = computed(() => {
  if (props.status === 'approved') return 'Your account is verified and can buy or sell on Agora.'
  if (props.status === 'rejected') return 'Update your profile and submit again for another review.'
  return 'Your profile is being reviewed by an administrator.'
})

const statusClass = computed(() => {
  if (props.status === 'approved') return 'border-success/20 bg-success/10'
  if (props.status === 'rejected') return 'border-danger/20 bg-danger/10'
  return 'border-warning/20 bg-warning/10'
})

const iconClass = computed(() => {
  if (props.status === 'approved') return 'bg-success/20 text-success'
  if (props.status === 'rejected') return 'bg-danger/20 text-danger'
  return 'bg-warning/20 text-warning'
})
</script>
