<template>
  <div class="card p-0 overflow-hidden flex flex-col h-full">
    <div class="p-5 border-b border-border bg-surface-3/30 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-text-1">Recent Activity</h2>
    </div>

    <div class="flex-1 overflow-y-auto">
      <template v-if="loading">
        <ul class="activity-list">
          <li v-for="i in 4" :key="i" class="activity-item skeleton-mode">
            <div class="skeleton activity-icon-skel" />
            <div class="activity-content-skel">
              <div class="skeleton h-4 w-3/4 rounded mb-2" />
              <div class="skeleton h-3 w-1/4 rounded" />
            </div>
          </li>
        </ul>
      </template>
      
      <template v-else-if="!activities || activities.length === 0">
        <div class="empty-state py-10">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-3 mb-3">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
          <p class="text-sm font-medium text-text-2">No recent activity</p>
        </div>
      </template>

      <template v-else>
        <ul class="activity-list">
          <li v-for="activity in activities" :key="activity.id" class="activity-item">
            <div class="activity-icon">
              <!-- Default Icon -->
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div class="activity-content">
              <p class="activity-desc">{{ activity.description }}</p>
              <p class="activity-time">{{ formatRelative(activity.created_at) }}</p>
            </div>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script setup>
import { formatRelative } from '@/utils/formatters'

defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover:not(.skeleton-mode) {
  background-color: var(--color-surface-3);
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary-ghost);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-1);
  line-height: var(--line-height-relaxed);
}

.activity-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: var(--spacing-1);
}

.activity-icon-skel {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.activity-content-skel {
  flex: 1;
  padding-top: 4px;
}
</style>
