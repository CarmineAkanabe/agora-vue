<template>
  <div v-if="auth.isLoggedIn" class="notif-wrapper" ref="wrapperRef">
    <!-- Bell button -->
    <button class="notif-trigger" @click="toggleOpen">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="notifStore.hasUnread" class="notif-badge">
        {{ notifStore.unreadCount > 9 ? '9+' : notifStore.unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="open" class="notif-dropdown">
        <!-- Header -->
        <div class="notif-header">
          <span class="notif-header-title">Notifications</span>
          <button
            v-if="notifStore.hasUnread"
            class="notif-mark-all"
            @click="notifStore.markAllAsRead()"
          >
            Mark all read
          </button>
        </div>

        <!-- List -->
        <div class="notif-list">
          <template v-if="notifStore.loading">
            <div v-for="n in 3" :key="n" class="notif-skeleton">
              <div class="skeleton skeleton-avatar" />
              <div class="notif-skeleton-content">
                <div class="skeleton skeleton-text-sm" />
                <div class="skeleton skeleton-text-sm short" />
              </div>
            </div>
          </template>

          <template v-else-if="notifStore.notifications.length === 0">
            <div class="notif-empty">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                opacity="0.3"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p>No notifications yet</p>
            </div>
          </template>

          <template v-else>
            <NotificationItem
              v-for="notif in notifStore.notifications.slice(0, 10)"
              :key="notif.id"
              :notification="notif"
              :read="!!notif.read_at"
              @read="notifStore.markAsRead(notif.id)"
              @delete="notifStore.destroy(notif.id)"
            />
          </template>
        </div>

        <!-- Footer -->
        <div class="notif-footer">
          <router-link :to="{ name: 'notifications' }" class="notif-view-all" @click="open = false">
            View all notifications
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNotificationStore } from '@/stores/useNotificationStore'
import NotificationItem from '@/components/notifications/NotificationItem.vue'

const auth = useAuthStore()
const notifStore = useNotificationStore()
const open = ref(false)
const wrapperRef = ref(null)

const toggleOpen = async () => {
  if (!auth.isLoggedIn) return

  open.value = !open.value
  if (open.value) {
    await notifStore.fetchNotifications()
  }
}

// Close on outside click
const handleOutsideClick = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    open.value = false
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.notif-wrapper {
  position: relative;
}

.notif-trigger {
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-2);
  display: flex;
  align-items: center;
  padding: var(--spacing-2);
  border-radius: var(--radius-base);
  transition: color var(--transition-fast);
}

.notif-trigger:hover {
  color: var(--color-text-1);
  background-color: var(--color-surface-3);
}

.notif-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  background-color: var(--color-danger);
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

.notif-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 360px;
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  overflow: hidden;
}

.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
}

.notif-header-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
}

.notif-mark-all {
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-xs);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.notif-mark-all:hover {
  color: var(--color-primary-dim);
}

.notif-list {
  max-height: 380px;
  overflow-y: auto;
}

.notif-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-10);
  color: var(--color-text-3);
  font-size: var(--font-size-sm);
}

.notif-skeleton {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-5);
  border-bottom: 1px solid var(--color-border);
}

.notif-skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.notif-footer {
  padding: var(--spacing-3) var(--spacing-5);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.notif-view-all {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--transition-fast);
}

.notif-view-all:hover {
  color: var(--color-primary-dim);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-base);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
