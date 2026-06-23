<template>
  <label :for="htmlFor" class="label">
    <slot />
    <span v-if="required" class="label-required">*</span>
  </label>
</template>

<script setup>
// ============================================================
// Label.vue
// Standalone label for use outside Input.vue
// ============================================================

defineProps({
  htmlFor:  { type: String, default: null },
  required: { type: Boolean, default: false },
})
</script>

<style scoped>
.label-required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}
</style>
