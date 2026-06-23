<template>
  <div :class="['divider', text ? 'divider-with-text' : '']">
    <span v-if="text" class="divider-text">{{ text }}</span>
  </div>
</template>

<script setup>
// ============================================================
// Divider.vue
// Optional centered text label (e.g. "or")
// ============================================================

defineProps({
  text: { type: String, default: null },
})
</script>

<style scoped>
.divider-with-text {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
}

.divider-with-text::before,
.divider-with-text::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--color-border);
}

.divider-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  white-space: nowrap;
}
</style>
