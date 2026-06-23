<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :disabled="tag === 'button' ? (disabled || loading) : undefined"
    :class="classes"
    v-bind="$attrs"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="btn-spinner"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        cx="12" cy="12" r="10"
        stroke="currentColor"
        stroke-width="3"
        opacity="0.3"
      />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>

    <!-- Left icon slot -->
    <slot name="icon-left" />

    <!-- Default slot -->
    <slot />

    <!-- Right icon slot -->
    <slot name="icon-right" />
  </component>
</template>

<script setup>
import { computed } from 'vue'

// ============================================================
// Button.vue
// Variants: primary | secondary | accent | danger | ghost
// Sizes:    sm | md (default) | lg
// Can render as: button | a | router-link
// ============================================================

const props = defineProps({
  variant:  { type: String, default: 'primary' },
  size:     { type: String, default: 'md' },
  type:     { type: String, default: 'button' },
  href:     { type: String, default: null },
  to:       { type: [String, Object], default: null },
  disabled: { type: Boolean, default: false },
  loading:  { type: Boolean, default: false },
  block:    { type: Boolean, default: false },
})

const tag = computed(() => {
  if (props.to)   return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  props.size === 'sm' ? 'btn-sm' : '',
  props.size === 'lg' ? 'btn-lg' : '',
  props.block   ? 'btn-block' : '',
  props.loading ? 'btn-loading' : '',
  (props.disabled || props.loading) ? 'btn-disabled' : '',
])
</script>

<style scoped>
.btn-spinner {
  width: 1em;
  height: 1em;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

.btn-block {
  width: 100%;
}

.btn-loading {
  cursor: wait;
}

.btn-disabled {
  opacity: 0.5;
  pointer-events: none;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
