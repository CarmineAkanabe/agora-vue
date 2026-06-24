<template>
  <div :class="['rating-stars', { interactive }]" role="group" :aria-label="ariaLabel">
    <button
      v-for="star in 5"
      :key="star"
      type="button"
      :class="['rating-star', { filled: star <= displayValue, hovered: star <= hoverValue }]"
      :disabled="!interactive"
      :aria-label="`${star} star${star > 1 ? 's' : ''}`"
      @mouseenter="interactive && (hoverValue = star)"
      @mouseleave="interactive && (hoverValue = 0)"
      @click="interactive && selectStar(star)"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" :fill="star <= displayValue ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
    <span v-if="showValue && modelValue" class="rating-value">{{ formattedValue }}</span>
    <span v-if="showCount && count !== null" class="rating-count">({{ count }})</span>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatRating } from '@/utils/formatters'

// ============================================================
// RatingStars.vue
// Two modes:
//   - Display: shows a fixed rating (interactive=false)
//   - Interactive: user can click to select a rating
// ============================================================

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  interactive: { type: Boolean, default: false },
  showValue: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  count: { type: Number, default: null },
  size: { type: String, default: 'md' },
})

const emit = defineEmits(['update:modelValue'])

const hoverValue = ref(0)

const displayValue = computed(() => {
  if (props.interactive && hoverValue.value > 0) return hoverValue.value
  return Math.round(props.modelValue)
})

const formattedValue = computed(() => formatRating(props.modelValue))

const ariaLabel = computed(() =>
  props.interactive ? 'Select a rating' : `Rating: ${props.modelValue} out of 5`,
)

const selectStar = (value) => {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.rating-stars {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-1);
}

.rating-star {
  background: none;
  border: none;
  padding: 2px;
  cursor: default;
  color: var(--color-border);
  transition: color var(--transition-fast), transform var(--transition-fast);
  display: flex;
  align-items: center;
}

.rating-star.filled {
  color: var(--color-accent);
}

.interactive .rating-star {
  cursor: pointer;
}

.interactive .rating-star:hover {
  transform: scale(1.15);
}

.interactive .rating-star.hovered {
  color: var(--color-accent);
}

.rating-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
  margin-left: var(--spacing-2);
}

.rating-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-3);
  margin-left: var(--spacing-1);
}
</style>
