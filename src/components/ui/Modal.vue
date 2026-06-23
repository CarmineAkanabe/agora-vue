<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="overlay" @click.self="onOverlayClick">

        <div :class="['modal', `modal-${variant}`]" role="dialog" aria-modal="true">

          <!-- Header -->
          <div class="modal-header">
            <h4 class="modal-title">{{ title }}</h4>
            <button class="modal-close" @click="close" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <slot>
              <p v-if="message">{{ message }}</p>
            </slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer || showActions" class="modal-footer">
            <slot name="footer">
              <button class="btn btn-ghost" @click="close" :disabled="loading">
                {{ cancelLabel }}
              </button>
              <button
                :class="['btn', confirmClass]"
                @click="$emit('confirm')"
                :disabled="loading"
              >
                <svg
                  v-if="loading"
                  class="btn-spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.3" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {{ confirmLabel }}
              </button>
            </slot>
          </div>

        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

// ============================================================
// Modal.vue
// Variants: default | alert | confirm | form
// Use showActions for built-in confirm/cancel buttons.
// Use footer slot for custom footer content.
// Teleports to body to avoid z-index stacking issues.
// ============================================================

const props = defineProps({
  modelValue:   { type: Boolean, default: false },
  title:        { type: String,  default: '' },
  message:      { type: String,  default: null },
  variant:      { type: String,  default: 'default' },
  showActions:  { type: Boolean, default: false },
  loading:      { type: Boolean, default: false },
  confirmLabel: { type: String,  default: 'Confirm' },
  cancelLabel:  { type: String,  default: 'Cancel' },
  closeOnOverlay: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const onOverlayClick = () => {
  if (props.closeOnOverlay) close()
}

const confirmClass = computed(() => {
  const map = {
    danger:  'btn-danger',
    alert:   'btn-danger',
    default: 'btn-primary',
    form:    'btn-primary',
  }
  return map[props.variant] ?? 'btn-primary'
})
</script>

<style scoped>
.modal {
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: var(--z-modal);
  position: relative;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-5) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-3);
  display: flex;
  align-items: center;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.modal-close:hover {
  color: var(--color-text-1);
}

.modal-body {
  padding: var(--spacing-6);
  color: var(--color-text-2);
  line-height: var(--line-height-relaxed);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform var(--transition-base), opacity var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal {
  transform: translateY(-16px) scale(0.98);
}

.modal-leave-to .modal {
  transform: translateY(8px) scale(0.98);
}

.btn-spinner {
  width: 1em;
  height: 1em;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
