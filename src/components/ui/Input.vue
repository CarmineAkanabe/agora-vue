<template>
  <div class="input-wrapper">

    <!-- Label -->
    <label v-if="label" :for="inputId" class="label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <!-- Input container (for icon support) -->
    <div class="input-container">

      <!-- Left icon -->
      <span v-if="$slots['icon-left']" class="input-icon input-icon-left">
        <slot name="icon-left" />
      </span>

      <!-- Input element -->
      <input
        :id="inputId"
        v-bind="$attrs"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="[
          'input',
          error ? 'input-error' : '',
          $slots['icon-left']  ? 'input-with-icon-left'  : '',
          $slots['icon-right'] ? 'input-with-icon-right' : '',
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />

      <!-- Right icon -->
      <span v-if="$slots['icon-right']" class="input-icon input-icon-right">
        <slot name="icon-right" />
      </span>

    </div>

    <!-- Error message -->
    <span v-if="error" class="error-message">{{ error }}</span>

    <!-- Hint message -->
    <span v-else-if="hint" class="input-hint">{{ hint }}</span>

  </div>
</template>

<script setup>
import { computed } from 'vue'

// ============================================================
// Input.vue
// Supports v-model, label, error, hint, icons (left/right).
// Variants handled via error prop (default | error | disabled)
// ============================================================

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  type:        { type: String, default: 'text' },
  label:       { type: String, default: null },
  placeholder: { type: String, default: '' },
  error:       { type: String, default: null },
  hint:        { type: String, default: null },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
  id:          { type: String, default: null },
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => props.id ?? `input-${Math.random().toString(36).slice(2, 7)}`)
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.input-required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  display: flex;
  align-items: center;
  color: var(--color-text-3);
  pointer-events: none;
}

.input-icon-left  { left: var(--spacing-3); }
.input-icon-right { right: var(--spacing-3); }

.input-with-icon-left  { padding-left: var(--spacing-10); }
.input-with-icon-right { padding-right: var(--spacing-10); }

.input-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
}
</style>
