<template>
  <article class="review-card">
    <div class="review-card-header">
      <div class="review-card-reviewer">
        <div class="review-avatar">
          {{ getInitials(review.reviewer?.name) }}
        </div>
        <div>
          <p class="review-reviewer-name">{{ review.reviewer?.name || 'Anonymous' }}</p>
          <p class="review-date">{{ formatRelative(review.created_at) }}</p>
        </div>
      </div>
      <RatingStars :model-value="review.rating" />
    </div>

    <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
    <p v-else class="review-comment review-comment-empty">No comment provided.</p>
  </article>
</template>

<script setup>
import RatingStars from '@/components/reviews/RatingStars.vue'
import { formatRelative, getInitials } from '@/utils/formatters'

defineProps({ review: { type: Object, required: true } })
</script>

<style scoped>
.review-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface-3);
  padding: var(--spacing-5);
  transition: border-color var(--transition-fast);
}

.review-card:hover {
  border-color: var(--color-text-3);
}

.review-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.review-card-reviewer {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.review-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
  flex-shrink: 0;
}

.review-reviewer-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.review-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: 1px;
}

.review-comment {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  line-height: var(--line-height-relaxed);
  margin-top: var(--spacing-3);
}

.review-comment-empty {
  font-style: italic;
  color: var(--color-text-3);
}
</style>
