<template>
  <div class="tooltip-wrapper" @mouseenter="show = true" @mouseleave="show = false">

    <!-- Trigger element -->
    <slot />

    <!-- Tooltip -->
    <Transition name="tooltip">
      <div v-if="show && text" :class="['tooltip', `tooltip-${position}`]">
        {{ text }}
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref } from 'vue'

// ============================================================
// Tooltip.vue
// Positions: top | bottom | left | right
// Wrap any element with this component to add a tooltip.
// ============================================================

defineProps({
  text:     { type: String, default: '' },
  position: {
    type: String,
    default: 'top',
    validator: (v) => ['top', 'bottom', 'left', 'right'].includes(v),
  },
})

const show = ref(false)
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip {
  position: absolute;
  background-color: var(--color-surface-1);
  border: 1px solid var(--color-border);
  color: var(--color-text-1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-sm);
  white-space: nowrap;
  z-index: var(--z-tooltip, 70);
  box-shadow: var(--shadow-md);
  pointer-events: none;
}

/* Positions */
.tooltip-top {
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-bottom {
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
}

.tooltip-left {
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

.tooltip-right {
  left: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
}

/* Transition */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity var(--transition-fast);
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
