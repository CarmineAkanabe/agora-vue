import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Notification Store
// Polls the API every 30 seconds while user is logged in.
// The bell icon in AuthNavbar reads unreadCount from here.
// ============================================================

export const useNotificationStore = defineStore('notification', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const notifications = ref([])
  const loading       = ref(false)
  let   pollingTimer  = null

  // ----------------------------------------------------------
  // Computed
  // ----------------------------------------------------------

  const unreadCount = computed(() =>
    notifications.value.filter((n) => !n.read_at).length
  )

  const hasUnread = computed(() => unreadCount.value > 0)

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const fetchNotifications = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.NOTIFICATIONS.INDEX)
      notifications.value = data.notifications
    } catch (error) {
      console.error('[NotificationStore] fetchNotifications:', error)
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (uuid) => {
    try {
      await api.post(API.NOTIFICATIONS.READ(uuid))
      const n = notifications.value.find((n) => n.id === uuid)
      if (n) n.read_at = new Date().toISOString()
    } catch (error) {
      console.error('[NotificationStore] markAsRead:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post(API.NOTIFICATIONS.READ_ALL)
      notifications.value = notifications.value.map((n) => ({
        ...n,
        read_at: n.read_at ?? new Date().toISOString(),
      }))
    } catch (error) {
      console.error('[NotificationStore] markAllAsRead:', error)
    }
  }

  const destroy = async (uuid) => {
    try {
      await api.delete(API.NOTIFICATIONS.DESTROY(uuid))
      notifications.value = notifications.value.filter((n) => n.id !== uuid)
    } catch (error) {
      console.error('[NotificationStore] destroy:', error)
    }
  }

  // ----------------------------------------------------------
  // Polling
  // Start when user logs in. Stop on logout.
  // AuthNavbar bell stays live without manual refresh.
  // ----------------------------------------------------------

  const startPolling = (intervalMs = 30000) => {
    stopPolling()
    fetchNotifications()

    pollingTimer = setInterval(() => {
      fetchNotifications()
    }, intervalMs)
  }

  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    notifications,
    loading,
    unreadCount,
    hasUnread,

    fetchNotifications,
    markAsRead,
    markAllAsRead,
    destroy,
    startPolling,
    stopPolling,
  }

})
