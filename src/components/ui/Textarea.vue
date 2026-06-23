<template>
  <div class="input-wrapper">

    <label v-if="label" :for="textareaId" class="label">
      {{ label }}
      <span v-if="required" class="input-required">*</span>
    </label>

    <textarea
      :id="textareaId"
      v-bind="$attrs"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :rows="rows"
      :class="['input', 'textarea', error ? 'input-error' : '']"
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="$emit('blur', $event)"
    />

    <span v-if="error" class="error-message">{{ error }}</span>
    <span v-else-if="hint" class="input-hint">{{ hint }}</span>

  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue:  { type: String, default: '' },
  label:       { type: String, default: null },
  placeholder: { type: String, default: '' },
  error:       { type: String, default: null },
  hint:        { type: String, default: null },
  disabled:    { type: Boolean, default: false },
  required:    { type: Boolean, default: false },
  rows:        { type: Number, default: 4 },
  id:          { type: String, default: null },
})

defineEmits(['update:modelValue', 'blur'])

const textareaId = computed(() => props.id ?? `textarea-${Math.random().toString(36).slice(2, 7)}`)
</script>

<style scoped>
.textarea {
  resize: vertical;
  min-height: 100px;
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
