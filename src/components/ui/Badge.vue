<template>
  <span :class="['badge', `badge-${variant}`, { 'badge-has-dot': dot }]">
    <span v-if="dot" class="badge-dot"></span>
    <slot />
  </span>
</template>

<script setup>
// ============================================================
// Badge.vue
// Variants: success | warning | danger | info | primary
// Used with constants: REQUEST_STATUS_VARIANTS,
//   TRANSACTION_STATUS_VARIANTS, VERIFICATION_STATUS_VARIANTS
// ============================================================

defineProps({
  variant: {
    type: String,
    default: 'info',
    validator: (v) => ['success', 'warning', 'danger', 'info', 'primary'].includes(v),
  },
  dot: {
    type: Boolean,
    default: false,
  }
})
</script>

<style scoped>
.badge-has-dot {
  padding-left: var(--spacing-2);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background-color: currentColor;
  animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  flex-shrink: 0;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}
</style>
