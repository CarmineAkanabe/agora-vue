<template>
  <span :class="['badge', `badge-${variant}`]">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { REQUEST_STATUS_LABELS, REQUEST_STATUS_VARIANTS } from '@/utils/constants'

const props = defineProps({
  status: { type: String, default: 'pending' },
})

const variant = computed(() => REQUEST_STATUS_VARIANTS[props.status] || 'info')
const label = computed(() => REQUEST_STATUS_LABELS[props.status] || props.status)
</script>
