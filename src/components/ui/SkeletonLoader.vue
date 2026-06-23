<template>
  <div :class="['skeleton-wrapper', `skeleton-${variant}`]">

    <!-- Card skeleton -->
    <template v-if="variant === 'card'">
      <div class="skeleton skeleton-img" />
      <div class="skeleton-content">
        <div class="skeleton skeleton-text-lg" />
        <div class="skeleton skeleton-text-sm" />
        <div class="skeleton skeleton-text-sm short" />
        <div class="skeleton-row">
          <div class="skeleton skeleton-badge" />
          <div class="skeleton skeleton-price" />
        </div>
      </div>
    </template>

    <!-- List item skeleton -->
    <template v-else-if="variant === 'list-item'">
      <div class="skeleton skeleton-avatar" />
      <div class="skeleton-content">
        <div class="skeleton skeleton-text-md" />
        <div class="skeleton skeleton-text-sm short" />
      </div>
    </template>

    <!-- Profile skeleton -->
    <template v-else-if="variant === 'profile'">
      <div class="skeleton-profile-header">
        <div class="skeleton skeleton-avatar-lg" />
        <div class="skeleton-content">
          <div class="skeleton skeleton-text-lg" />
          <div class="skeleton skeleton-text-sm" />
          <div class="skeleton skeleton-badge" />
        </div>
      </div>
      <div class="skeleton skeleton-text-sm" />
      <div class="skeleton skeleton-text-sm" />
      <div class="skeleton skeleton-text-sm short" />
    </template>

    <!-- Text skeleton -->
    <template v-else-if="variant === 'text'">
      <div class="skeleton skeleton-text-md" />
      <div class="skeleton skeleton-text-md" />
      <div class="skeleton skeleton-text-sm short" />
    </template>

  </div>
</template>

<script setup>
// ============================================================
// SkeletonLoader.vue
// Variants: card | list-item | profile | text
// Use :count prop to repeat multiple skeletons.
// ============================================================

defineProps({
  variant: {
    type: String,
    default: 'card',
    validator: (v) => ['card', 'list-item', 'profile', 'text'].includes(v),
  },
})
</script>

<style scoped>
.skeleton-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

/* Card */
.skeleton-card .skeleton-img {
  width: 100%;
  height: 180px;
  border-radius: var(--radius-md);
}

.skeleton-card .skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  padding: var(--spacing-3) 0;
}

.skeleton-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-1);
}

/* List item */
.skeleton-list-item {
  flex-direction: row;
  align-items: center;
}

.skeleton-list-item .skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* Profile */
.skeleton-profile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-4);
}

.skeleton-profile-header .skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

/* Common shapes */
.skeleton-avatar    { width: 40px; height: 40px; border-radius: var(--radius-full); flex-shrink: 0; }
.skeleton-avatar-lg { width: 64px; height: 64px; border-radius: var(--radius-full); flex-shrink: 0; }
.skeleton-text-lg   { height: 20px; width: 70%; border-radius: var(--radius-sm); }
.skeleton-text-md   { height: 16px; width: 90%; border-radius: var(--radius-sm); }
.skeleton-text-sm   { height: 14px; width: 80%; border-radius: var(--radius-sm); }
.skeleton-badge     { height: 22px; width: 70px; border-radius: var(--radius-full); }
.skeleton-price     { height: 20px; width: 80px; border-radius: var(--radius-sm); }
.short              { width: 50% !important; }
</style>
