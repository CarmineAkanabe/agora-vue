<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Notifications</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Inbox</h1>
        <p class="mt-3 text-lg text-text-2">
          You have <strong class="text-text-1">{{ notifStore.unreadCount }}</strong> unread notification{{ notifStore.unreadCount === 1 ? '' : 's' }}.
        </p>
      </div>
      <div v-if="notifStore.hasUnread">
        <Button variant="secondary" @click="notifStore.markAllAsRead()">
          Mark all as read
        </Button>
      </div>
    </div>

    <!-- Full list -->
    <NotificationList
      :notifications="notifStore.notifications"
      :loading="notifStore.loading && notifStore.notifications.length === 0"
      @read="notifStore.markAsRead"
      @delete="notifStore.destroy"
    />
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import { useNotificationStore } from '@/stores/useNotificationStore'
import NotificationList from '@/components/notifications/NotificationList.vue'
import Button from '@/components/ui/Button.vue'

const notifStore = useNotificationStore()

onMounted(() => {
  // If we haven't loaded notifications yet (e.g., navigated here directly), fetch them.
  // Polling via AuthStore will keep them updated.
  if (notifStore.notifications.length === 0) {
    notifStore.fetchNotifications()
  }
})
</script>
