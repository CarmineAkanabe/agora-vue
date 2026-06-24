import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Dashboard Store
// Handles fetching dashboard stats for students.
// ============================================================

export const useDashboardStore = defineStore('dashboard', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const stats   = ref(null)
  const loading = ref(false)
  const error   = ref(null)

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const fetchStats = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await api.get(API.DASHBOARD.STATS, {
        params: { t: Date.now() }
      })
      stats.value = data
    } catch (err) {
      console.error('[DashboardStore] fetchStats:', err)
      error.value = err.response?.data?.message || 'Failed to load dashboard statistics.'
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
})
