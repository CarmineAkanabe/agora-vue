import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import { API, STORAGE_KEYS } from '@/utils/constants'

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

  const user  = ref(JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) ?? null)
  const token = ref(localStorage.getItem(STORAGE_KEYS.TOKEN) ?? null)
  const loading = ref(false)
  const errors  = ref({})

  // ----------------------------------------------------------
  // Computed — used by router guards
  // ----------------------------------------------------------

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() => user.value?.role === 'admin')

  const isVerified = computed(() => {
    return user.value?.profile?.verification_status === 'approved'
  })

  const isStudent = computed(() => user.value?.role === 'student')

  const isBanned = computed(() => user.value?.is_banned === true)

  const hasProfile = computed(() => !!user.value?.profile)

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const setSession = (userData, tokenValue) => {
    user.value  = userData
    token.value = tokenValue
    localStorage.setItem(STORAGE_KEYS.USER,  JSON.stringify(userData))
    localStorage.setItem(STORAGE_KEYS.TOKEN, tokenValue)
  }

  const clearSession = () => {
    user.value  = null
    token.value = null
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

      // New student — no profile yet, go create one
      await router.push({ name: 'pending-verification' })

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

      // Redirect based on role and verification status
      if (data.user.role === 'admin') {
        await router.push({ name: 'admin-dashboard' })
        return
      }

      if (data.user.profile?.verification_status === 'approved') {
        await router.push({ name: 'dashboard' })
        return
      }

      await router.push({ name: 'pending-verification' })

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
      // Even if the API call fails, clear the session locally
    } finally {
      clearSession()
      loading.value = false
      await router.push({ name: 'login' })
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
  }

  /**
   * Refresh user data from the API.
   * Called on app mount to ensure stored user is still valid.
   */
  const refreshUser = async () => {
    if (!token.value) return

    try {
      const { data } = await api.get(API.PROFILE.SHOW)

      // Merge fresh profile into stored user
      user.value = { ...user.value, profile: data }
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user.value))

    } catch (error) {
      // 401 handled by axios interceptor — clears session and redirects
      if (error.response?.status !== 401) {
        console.warn('[AuthStore] Could not refresh user profile.')
      }
    }
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
    clearErrors,
  }

})
