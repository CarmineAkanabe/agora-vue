<template>
  <div class="tabs-wrapper">

    <!-- Tab headers -->
    <div :class="['tabs-header', `tabs-${variant}`]">
      <button
        v-for="(tab, index) in tabs"
        :key="index"
        :class="['tab-btn', modelValue === index ? 'tab-btn-active' : '']"
        @click="$emit('update:modelValue', index)"
      >
        <component
          v-if="tab.icon"
          :is="tab.icon"
          class="tab-icon"
          :size="16"
        />
        {{ tab.label }}
        <span v-if="tab.count !== undefined" class="tab-count">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Tab content -->
    <div class="tabs-content">
      <slot />
    </div>

  </div>
</template>

<script setup>
// ============================================================
// Tabs.vue
// Variants: underline | pill
// tabs: [{ label: string, icon?: Component, count?: number }]
// Use with v-model for active tab index.
// Content goes in default slot — conditionally render per tab.
// ============================================================

defineProps({
  tabs:       { type: Array,  default: () => [] },
  modelValue: { type: Number, default: 0 },
  variant:    {
    type: String,
    default: 'underline',
    validator: (v) => ['underline', 'pill'].includes(v),
  },
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.tabs-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

/* Underline variant */
.tabs-underline {
  display: flex;
  gap: var(--spacing-1);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.tabs-underline .tab-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
  white-space: nowrap;
  transition: all var(--transition-fast);
  margin-bottom: -1px;
}

.tabs-underline .tab-btn:hover {
  color: var(--color-text-1);
}

.tabs-underline .tab-btn-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* Pill variant */
.tabs-pill {
  display: flex;
  gap: var(--spacing-2);
  background-color: var(--color-surface-3);
  padding: var(--spacing-1);
  border-radius: var(--radius-md);
  overflow-x: auto;
}

.tabs-pill .tab-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-4);
  background: none;
  border: none;
  border-radius: var(--radius-base);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
  white-space: nowrap;
  transition: all var(--transition-fast);
}

.tabs-pill .tab-btn:hover {
  color: var(--color-text-1);
}

.tabs-pill .tab-btn-active {
  background-color: var(--color-surface-2);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
}

/* Count badge */
.tab-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 var(--spacing-1);
  background-color: var(--color-surface-3);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
}

.tab-btn-active .tab-count {
  background-color: var(--color-primary-ghost);
  color: var(--color-primary);
}

.tab-icon {
  flex-shrink: 0;
}

.tabs-content {
  min-height: 0;
}
</style>
