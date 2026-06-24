import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Admin Store
// Handles all admin panel data and actions.
// ============================================================

export const useAdminStore = defineStore('admin', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  // Verifications
  const verifications = ref([])
  const verification  = ref(null)

  // Users
  const users = ref([])
  const user  = ref(null)

  // Listings
  const listings = ref([])
  const listingsMeta = ref({})

  // Disputes
  const disputes = ref([])
  const dispute  = ref(null)

  // Reports
  const overview     = ref(null)
  const txReport     = ref(null)
  const listingReport= ref(null)
  const userReport   = ref(null)

  const loading = ref(false)
  const errors  = ref({})

  const clearErrors = () => { errors.value = {} }

  // ----------------------------------------------------------
  // Verifications
  // ----------------------------------------------------------

  const fetchVerifications = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.VERIFICATIONS.INDEX)
      verifications.value = data.data ?? data
    } catch (error) {
      console.error('[AdminStore] fetchVerifications:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchVerification = async (id) => {
    loading.value = true
    verification.value = null

    try {
      const { data } = await api.get(API.ADMIN.VERIFICATIONS.SHOW(id))
      verification.value = data.data ?? data
    } catch (error) {
      console.error('[AdminStore] fetchVerification:', error)
    } finally {
      loading.value = false
    }
  }

  const approveVerification = async (id) => {
    loading.value = true

    try {
      await api.post(API.ADMIN.VERIFICATIONS.APPROVE(id))
      removeFromList(verifications.value, id)
    } catch (error) {
      console.error('[AdminStore] approveVerification:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const rejectVerification = async (id, reason = null) => {
    loading.value = true

    try {
      await api.post(API.ADMIN.VERIFICATIONS.REJECT(id), { reason })
      removeFromList(verifications.value, id)
    } catch (error) {
      console.error('[AdminStore] rejectVerification:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Users
  // ----------------------------------------------------------

  const fetchUsers = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.USERS.INDEX)
      users.value = data.data ?? data
    } catch (error) {
      console.error('[AdminStore] fetchUsers:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async (id) => {
    loading.value = true
    user.value = null

    try {
      const { data } = await api.get(API.ADMIN.USERS.SHOW(id))
      user.value = data.data ?? data
    } catch (error) {
      console.error('[AdminStore] fetchUser:', error)
    } finally {
      loading.value = false
    }
  }

  const banUser = async (id) => {
    loading.value = true

    try {
      await api.post(API.ADMIN.USERS.BAN(id))
      const u = users.value.find((u) => u.id === id)
      if (u) u.is_banned = true
      if (user.value?.id === id) user.value.is_banned = true
    } catch (error) {
      console.error('[AdminStore] banUser:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const unbanUser = async (userId) => {
    loading.value = true

    try {
      await api.post(API.ADMIN.USERS.UNBAN(userId))
      const u = users.value.find((u) => u.id === userId)
      if (u) u.is_banned = false
      if (user.value && user.value.id === userId) {
        user.value.is_banned = false
      }
    } catch (error) {
      console.error('[AdminStore] unbanUser:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId) => {
    loading.value = true
    try {
      await api.delete(API.ADMIN.USERS.DESTROY(userId))
      users.value = users.value.filter((u) => u.id !== userId)
      if (user.value?.id === userId) user.value = null
    } catch (error) {
      console.error('[AdminStore] deleteUser:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Listings
  // ----------------------------------------------------------

  const fetchListings = async (page = 1) => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.LISTINGS.INDEX, { params: { page } })
      listings.value   = data.data
      listingsMeta.value = data.meta
    } catch (error) {
      console.error('[AdminStore] fetchListings:', error)
    } finally {
      loading.value = false
    }
  }

  const removeListing = async (id, reason = null) => {
    loading.value = true

    try {
      await api.post(API.ADMIN.LISTINGS.REMOVE(id), { reason })
      removeFromList(listings.value, id)
    } catch (error) {
      console.error('[AdminStore] removeListing:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Disputes
  // ----------------------------------------------------------

  const fetchDisputes = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.DISPUTES.INDEX)
      disputes.value = data
    } catch (error) {
      console.error('[AdminStore] fetchDisputes:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchDispute = async (id) => {
    loading.value = true
    dispute.value = null

    try {
      const { data } = await api.get(API.ADMIN.DISPUTES.SHOW(id))
      dispute.value = data
    } catch (error) {
      console.error('[AdminStore] fetchDispute:', error)
    } finally {
      loading.value = false
    }
  }

  const resolveDispute = async (id, resolution) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.ADMIN.DISPUTES.RESOLVE(id), { resolution })
      dispute.value = data
      updateInList(disputes.value, data)
      return data
    } catch (error) {
      if (error.response?.status === 422) {
        errors.value = error.response.data.errors ?? {}
      }
      throw error
    } finally {
      loading.value = false
    }
  }

  const closeDispute = async (id) => {
    loading.value = true

    try {
      await api.post(API.ADMIN.DISPUTES.CLOSE(id))
      if (dispute.value?.id === id) dispute.value.status = 'closed'
    } catch (error) {
      console.error('[AdminStore] closeDispute:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Reports
  // ----------------------------------------------------------

  const fetchOverview = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.REPORTS.OVERVIEW)
      console.log('[AdminStore] fetchOverview payload:', data)
      overview.value = data
    } catch (error) {
      console.error('[AdminStore] fetchOverview:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchTransactionReport = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.REPORTS.TRANSACTIONS)
      console.log('[AdminStore] fetchTransactionReport payload:', data)
      txReport.value = data
    } catch (error) {
      console.error('[AdminStore] fetchTransactionReport:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchListingReport = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.REPORTS.LISTINGS)
      console.log('[AdminStore] fetchListingReport payload:', data)
      listingReport.value = data
    } catch (error) {
      console.error('[AdminStore] fetchListingReport:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchUserReport = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.ADMIN.REPORTS.USERS)
      console.log('[AdminStore] fetchUserReport payload:', data)
      userReport.value = data
    } catch (error) {
      console.error('[AdminStore] fetchUserReport:', error)
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const removeFromList = (list, id) => {
    const index = list.findIndex((item) => item.id === id)
    if (index !== -1) list.splice(index, 1)
  }

  const updateInList = (list, updated) => {
    const index = list.findIndex((item) => item.id === updated.id)
    if (index !== -1) list[index] = updated
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    // State
    verifications, verification,
    users, user,
    listings, listingsMeta,
    disputes, dispute,
    overview, txReport, listingReport, userReport,
    loading, errors,

    // Verifications
    fetchVerifications, fetchVerification,
    approveVerification, rejectVerification,

    // Users
    fetchUsers, fetchUser, banUser, unbanUser, deleteUser,

    // Listings
    fetchListings, removeListing,

    // Disputes
    fetchDisputes, fetchDispute, resolveDispute, closeDispute,

    // Reports
    fetchOverview, fetchTransactionReport,
    fetchListingReport, fetchUserReport,

    clearErrors,
  }

})
