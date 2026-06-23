<template>
  <span :class="['badge', `badge-${variant}`]">
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
})
</script>
