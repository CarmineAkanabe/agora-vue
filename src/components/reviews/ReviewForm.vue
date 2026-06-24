<template>
  <div class="review-form-card">
    <div class="review-form-header">
      <div class="review-form-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>
      <div>
        <p class="review-form-label">Leave a Review</p>
        <p class="review-form-hint">Rate your experience with this seller</p>
      </div>
    </div>

    <!-- Success state -->
    <div v-if="submitted" class="review-form-success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <div>
        <p class="review-form-success-title">Review submitted</p>
        <p class="review-form-success-description">
          Thank you for your feedback. Your review helps other students make informed decisions.
        </p>
      </div>
    </div>

    <!-- Form -->
    <form v-else class="review-form" @submit.prevent="handleSubmit">
      <!-- Star selection -->
      <div class="review-form-field">
        <label class="label">Rating <span class="input-required">*</span></label>
        <RatingStars v-model="form.rating" interactive />
        <span v-if="fieldErrors.rating" class="error-message">{{ fieldErrors.rating }}</span>
      </div>

      <!-- Comment -->
      <UiTextarea
        v-model="form.comment"
        label="Comment"
        placeholder="Share your experience with this seller..."
        :error="fieldErrors.comment"
        :rows="3"
      />

      <!-- Server error -->
      <p v-if="serverError" class="review-form-server-error">{{ serverError }}</p>

      <!-- Submit -->
      <div class="review-form-actions">
        <Button
          type="submit"
          :loading="submitting"
          :disabled="submitting || !form.rating"
        >
          Submit review
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import RatingStars from '@/components/reviews/RatingStars.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import { useReviewStore } from '@/stores/useReviewStore'
import { rating as validateRating, required } from '@/utils/validators'

const props = defineProps({
  transactionId: { type: [String, Number], required: true },
})

const emit = defineEmits(['submitted'])

const reviewStore = useReviewStore()

const form = reactive({
  rating: 0,
  comment: '',
})

const submitting = ref(false)
const submitted = ref(false)
const serverError = ref('')
const fieldErrors = ref({})

const validate = () => {
  const errors = {}
  const ratingResult = validateRating(form.rating)
  if (ratingResult !== true) errors.rating = ratingResult
  fieldErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSubmit = async () => {
  if (!validate()) return

  submitting.value = true
  serverError.value = ''
  fieldErrors.value = {}

  try {
    const result = await reviewStore.storeReview({
      transaction_id: props.transactionId,
      rating: form.rating,
      comment: form.comment || undefined,
    })
    submitted.value = true
    emit('submitted', result)
  } catch (error) {
    const data = error.response?.data
    if (data?.errors) {
      fieldErrors.value = {}
      Object.entries(data.errors).forEach(([key, messages]) => {
        fieldErrors.value[key] = messages[0]
      })
    } else {
      serverError.value = data?.message || 'Unable to submit review. Please try again.'
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.review-form-card {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: rgba(34, 34, 44, 0.6);
  backdrop-filter: blur(8px);
  padding: var(--spacing-5) var(--spacing-6);
}

.review-form-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-5);
}

.review-form-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background-color: var(--color-accent-ghost);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.review-form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.review-form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: 2px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.review-form-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.input-required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}

.review-form-server-error {
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}

.review-form-actions {
  display: flex;
  justify-content: flex-end;
}

.review-form-success {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  border-radius: var(--radius-base);
  background-color: var(--color-success-ghost);
  color: var(--color-success);
}

.review-form-success svg {
  flex-shrink: 0;
  margin-top: 2px;
}

.review-form-success-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
}

.review-form-success-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-relaxed);
}
</style>
