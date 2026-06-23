<template>
  <div class="stepper">
    <div
      v-for="(step, index) in steps"
      :key="index"
      class="stepper-item"
    >
      <!-- Step indicator -->
      <div class="stepper-indicator-wrapper">
        <div
          :class="[
            'stepper-indicator',
            getStepState(index) === 'completed' ? 'stepper-completed' : '',
            getStepState(index) === 'active'    ? 'stepper-active'    : '',
            getStepState(index) === 'upcoming'  ? 'stepper-upcoming'  : '',
          ]"
        >
          <!-- Checkmark for completed -->
          <svg
            v-if="getStepState(index) === 'completed'"
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- Connector line -->
        <div
          v-if="index < steps.length - 1"
          :class="[
            'stepper-line',
            getStepState(index) === 'completed' ? 'stepper-line-done' : '',
          ]"
        />
      </div>

      <!-- Step label -->
      <div class="stepper-label">
        <span
          :class="[
            'stepper-title',
            getStepState(index) === 'active' ? 'stepper-title-active' : '',
          ]"
        >
          {{ step.label }}
        </span>
        <span v-if="step.description" class="stepper-description">
          {{ step.description }}
        </span>
      </div>

    </div>
  </div>
</template>

<script setup>
// ============================================================
// Stepper.vue
// Used in the purchase/payment flow:
// Request → Payment → Pickup → Complete
//
// steps: [{ label: string, description?: string }]
// currentStep: index of active step (0-based)
// ============================================================

const props = defineProps({
  steps:       { type: Array,  default: () => [] },
  currentStep: { type: Number, default: 0 },
})

const getStepState = (index) => {
  if (index < props.currentStep)  return 'completed'
  if (index === props.currentStep) return 'active'
  return 'upcoming'
}
</script>

<style scoped>
.stepper {
  display: flex;
  align-items: flex-start;
  gap: 0;
  width: 100%;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: var(--spacing-2);
}

.stepper-indicator-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  position: relative;
}

.stepper-indicator {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: all var(--transition-base);
}

.stepper-completed {
  background-color: var(--color-success);
  color: white;
}

.stepper-active {
  background-color: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-glow-primary);
}

.stepper-upcoming {
  background-color: var(--color-surface-3);
  color: var(--color-text-3);
  border: 2px solid var(--color-border);
}

.stepper-line {
  flex: 1;
  height: 2px;
  background-color: var(--color-border);
  position: absolute;
  left: calc(50% + 16px);
  right: calc(-50% + 16px);
  top: 50%;
  transform: translateY(-50%);
}

.stepper-line-done {
  background-color: var(--color-success);
}

.stepper-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-1);
}

.stepper-title {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
  white-space: nowrap;
}

.stepper-title-active {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
}

.stepper-description {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
}
</style>
