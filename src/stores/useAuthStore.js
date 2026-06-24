import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import { API, STORAGE_KEYS } from '@/utils/constants'
import { useNotificationStore } from '@/stores/useNotificationStore'

// ============================================================
// Agora — Auth Store
// Handles login, register, logout and user state.
// Guards depend on: isLoggedIn, isAdmin, isVerified.
// ============================================================

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const user = ref(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) ?? null)
  const token = ref(localStorage.getItem(STORAGE_KEYS.TOKEN) ?? null)
  const loading = ref(false)
  const errors = ref({})

  // ----------------------------------------------------------
  // Computed — used by router guards
  // ----------------------------------------------------------

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() => user.value?.role === 'admin')

  const isVerified = computed(() => user.value?.profile?.verification_status === 'approved')

  const isStudent = computed(() => user.value?.role === 'student')

  const isBanned = computed(() => user.value?.is_banned === true)

  const hasProfile = computed(() => !!user.value?.profile)

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const getDefaultRedirectName = () => {
    if (isAdmin.value) return 'admin-dashboard'
    if (isVerified.value) return 'dashboard'
    return 'pending-verification'
  }

  const syncNotifications = () => {
    const notificationStore = useNotificationStore()

    if (isLoggedIn.value && !isAdmin.value) {
      notificationStore.startPolling()
      return
    }

    notificationStore.stopPolling()
  }

  const setSession = (userData, tokenValue) => {
    user.value = userData
    token.value = tokenValue
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData))
    localStorage.setItem(STORAGE_KEYS.TOKEN, tokenValue)
    syncNotifications()
  }

  const clearSession = () => {
    const notificationStore = useNotificationStore()
    notificationStore.stopPolling()

    user.value = null
    token.value = null
    errors.value = {}
    localStorage.removeItem(STORAGE_KEYS.USER)
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
  }

  const clearErrors = () => {
    errors.value = {}
  }

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const register = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.AUTH.REGISTER, payload)
      setSession(data.user, data.token)
      await router.replace({ name: 'pending-verification' })
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors ?? {}
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const login = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.AUTH.LOGIN, payload)
      setSession(data.user, data.token)
      
      // Fetch profile to ensure isVerified is accurate before redirecting
      await refreshUser()
      
      await router.replace({ name: getDefaultRedirectName() })
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors ?? {}
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true

    try {
      await api.post(API.AUTH.LOGOUT)
    } catch {
      // Even if the API call fails, clear the session locally.
    } finally {
      clearSession()
      loading.value = false
      await router.replace({ name: 'login' })
    }
  }

  /**
   * Update the local user object after profile changes.
   * Called by useProfileStore after profile create/update.
   * Keeps auth state in sync without a full re-login.
   */
  const updateUser = (updatedUser) => {
    user.value = updatedUser
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser))
    syncNotifications()
  }

  /**
   * Refresh user data from the API.
   * Called on app mount to ensure stored user is still valid.
   */
  const refreshUser = async () => {
    if (!token.value || !user.value) {
      syncNotifications()
      return
    }

    if (isAdmin.value) {
      syncNotifications()
      return
    }

    try {
      const { data } = await api.get(API.PROFILE.SHOW)
      const profile = data?.profile ?? data ?? null

      user.value = { ...user.value, profile }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
      syncNotifications()
    } catch (error) {
      if (error.response?.status === 401) {
        clearSession()
        await router.replace({ name: 'login' })
        return
      }

      if (error.response?.status === 404) {
        user.value = { ...user.value, profile: null }
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))
        syncNotifications()
        return
      }

      if (error.response?.status !== 403) {
        console.warn('[AuthStore] Could not refresh user profile.', error)
      }

      syncNotifications()
    }
  }

  const initialize = async () => {
    if (!token.value) {
      syncNotifications()
      return
    }

    await refreshUser()
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    // State
    user,
    token,
    loading,
    errors,

    // Computed
    isLoggedIn,
    isAdmin,
    isVerified,
    isStudent,
    isBanned,
    hasProfile,

    // Actions
    register,
    login,
    logout,
    updateUser,
    refreshUser,
    initialize,
    clearErrors,
  }
})
