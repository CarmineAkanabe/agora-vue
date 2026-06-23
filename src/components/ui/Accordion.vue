<template>
  <div class="accordion">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="['accordion-item', openIndex === index ? 'accordion-item-open' : '']"
    >
      <!-- Header -->
      <button class="accordion-header" @click="toggle(index)">
        <span class="accordion-title">{{ item.title }}</span>
        <svg
          class="accordion-chevron"
          width="18" height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <!-- Body -->
      <Transition name="accordion">
        <div v-if="openIndex === index" class="accordion-body">
          <div class="accordion-content">
            <slot :item="item" :index="index">
              {{ item.content }}
            </slot>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// ============================================================
// Accordion.vue
// Items: [{ title: string, content: string }]
// Supports default slot for custom content per item.
// Only one item open at a time.
// ============================================================

defineProps({
  items: { type: Array, default: () => [] },
})

const openIndex = ref(null)

const toggle = (index) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.accordion {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.accordion-item {
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color var(--transition-fast);
}

.accordion-item-open {
  border-color: var(--color-primary);
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-5);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: var(--spacing-4);
}

.accordion-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-1);
}

.accordion-chevron {
  color: var(--color-text-3);
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.accordion-item-open .accordion-chevron {
  transform: rotate(180deg);
  color: var(--color-primary);
}

.accordion-content {
  padding: 0 var(--spacing-5) var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  line-height: var(--line-height-relaxed);
}

/* Transition */
.accordion-enter-active,
.accordion-leave-active {
  transition: all var(--transition-base);
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 300px;
}
</style>
