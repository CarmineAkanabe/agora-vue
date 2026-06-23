<template>
  <div class="input-wrapper">

    <label v-if="label" :for="selectId" class="label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <div class="select-container">
      <select
        :id="selectId"
        v-bind="$attrs"
        :value="modelValue"
        :disabled="disabled"
        :class="['input', 'select', error ? 'input-error' : '']"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Chevron icon -->
      <span class="select-chevron">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </div>

    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="input-hint">{{ hint }}</span>

  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  options:     { type: Array, default: () => [] },
  label:       { type: String, default: null },
  placeholder: { type: String, default: 'Select an option' },
  error:       { type: String, default: null },
  hint:        { type: String, default: null },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
  id:          { type: String, default: null },
})

defineEmits(['update:modelValue'])

const selectId = computed(() => props.id ?? `select-${Math.random().toString(36).slice(2, 7)}`)
</script>

<style scoped>
.select-container {
  position: relative;
}

.select {
  appearance: none;
  cursor: pointer;
  padding-right: var(--spacing-10);
}

.select-chevron {
  position: absolute;
  right: var(--spacing-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-3);
  pointer-events: none;
  display: flex;
  align-items: center;
}

.input-required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}

.input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
}
</style>
