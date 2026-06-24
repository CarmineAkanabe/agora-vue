<template>
  <div class="card p-0 overflow-hidden">
    <!-- Loading State -->
    <template v-if="loading">
      <ul class="notif-list">
        <li v-for="n in 5" :key="n" class="notif-skeleton">
          <div class="skeleton skeleton-avatar" />
          <div class="notif-skeleton-content">
            <div class="skeleton h-5 w-1/3 rounded mb-2" />
            <div class="skeleton h-4 w-2/3 rounded" />
          </div>
        </li>
      </ul>
    </template>

    <!-- Empty State -->
    <template v-else-if="notifications.length === 0">
      <div class="empty-state py-16">
        <svg
          class="empty-state-icon"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <p class="text-lg font-semibold text-text-2">You're all caught up!</p>
        <p class="text-sm text-text-3">No new notifications to display.</p>
      </div>
    </template>

    <!-- Notification List -->
    <template v-else>
      <ul class="notif-list">
        <NotificationItem
          v-for="notif in notifications"
          :key="notif.id"
          :notification="notif"
          :read="!!notif.read_at"
          @read="emit('read', notif.id)"
          @delete="emit('delete', notif.id)"
        />
      </ul>
    </template>
  </div>
</template>

<script setup>
import NotificationItem from '@/components/notifications/NotificationItem.vue'

defineProps({
  notifications: { type: Array, required: true },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['read', 'delete'])
</script>

<style scoped>
.notif-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.notif-skeleton {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
}

.notif-skeleton:last-child {
  border-bottom: none;
}

.notif-skeleton-content {
  flex: 1;
}

.skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
</style>
