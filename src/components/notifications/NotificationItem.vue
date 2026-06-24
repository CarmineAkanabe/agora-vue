<template>
  <li :class="['notif-item', { 'notif-unread': !read }]">
    <div class="notif-content-wrapper">
      <button class="notif-body" @click="emit('read')">
        <div class="notif-text">
          <p class="notif-title">{{ notificationTitle }}</p>
          <p class="notif-message">{{ notificationMessage }}</p>
          <p v-if="notification?.created_at" class="notif-time">
            {{ formatRelative(notification.created_at) }}
          </p>
        </div>
        <span v-if="!read" class="notif-dot" />
      </button>
      <button class="notif-remove" @click="emit('delete')" aria-label="Remove notification">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { formatRelative } from '@/utils/formatters'

const props = defineProps({
  notification: { type: Object, default: null },
  title: { type: String, default: 'Notification' },
  message: { type: String, default: '' },
  read: { type: Boolean, default: false },
})

const emit = defineEmits(['read', 'delete'])

const notificationTitle = computed(() => props.notification?.title ?? props.title)
const notificationMessage = computed(() => props.notification?.message ?? props.message)
</script>

<style scoped>
.notif-item {
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
}

.notif-item:last-child {
  border-bottom: none;
}

.notif-item:hover {
  background-color: var(--color-surface-3);
}

.notif-unread {
  background-color: rgba(124, 58, 237, 0.05); /* very subtle primary tint */
}

.notif-content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-5);
}

.notif-body {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.notif-text {
  flex: 1;
}

.notif-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-1);
}

.notif-unread .notif-title {
  font-weight: var(--font-weight-semibold);
}

.notif-message {
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  margin-top: var(--spacing-1);
  line-height: var(--line-height-relaxed);
}

.notif-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  margin-top: var(--spacing-2);
}

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background-color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 6px;
  box-shadow: 0 0 8px var(--color-primary-ghost);
}

.notif-remove {
  background: none;
  border: none;
  color: var(--color-text-3);
  cursor: pointer;
  padding: var(--spacing-1);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast), background-color var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-remove:hover {
  color: var(--color-danger);
  background-color: var(--color-danger-ghost);
}
</style>
