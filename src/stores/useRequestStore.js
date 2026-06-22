import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Purchase Request Store
// ============================================================

export const useRequestStore = defineStore('request', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const sentRequests     = ref([])
  const receivedRequests = ref([])
  const request          = ref(null)
  const loading          = ref(false)
  const errors           = ref({})

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const clearErrors = () => { errors.value = {} }

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const fetchSentRequests = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.REQUESTS.SENT)
      sentRequests.value = data
    } catch (error) {
      console.error('[RequestStore] fetchSentRequests:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchReceivedRequests = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.REQUESTS.RECEIVED)
      receivedRequests.value = data
    } catch (error) {
      console.error('[RequestStore] fetchReceivedRequests:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchRequest = async (id) => {
    loading.value = true
    request.value = null

    try {
      const { data } = await api.get(API.REQUESTS.SHOW(id))
      request.value = data
    } catch (error) {
      console.error('[RequestStore] fetchRequest:', error)
    } finally {
      loading.value = false
    }
  }

  const storeRequest = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.REQUESTS.STORE, payload)
      sentRequests.value.unshift(data)
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

  const approveRequest = async (id) => {
    loading.value = true

    try {
      const { data } = await api.post(API.REQUESTS.APPROVE(id))
      updateInList(receivedRequests.value, data)
      if (request.value?.id === id) request.value = data
      return data
    } catch (error) {
      console.error('[RequestStore] approveRequest:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const rejectRequest = async (id, reason = null) => {
    loading.value = true

    try {
      const { data } = await api.post(API.REQUESTS.REJECT(id), { reason })
      updateInList(receivedRequests.value, data)
      if (request.value?.id === id) request.value = data
      return data
    } catch (error) {
      console.error('[RequestStore] rejectRequest:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const cancelRequest = async (id) => {
    loading.value = true

    try {
      const { data } = await api.post(API.REQUESTS.CANCEL(id))
      updateInList(sentRequests.value, data)
      if (request.value?.id === id) request.value = data
      return data
    } catch (error) {
      console.error('[RequestStore] cancelRequest:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Helper — update item in list by id
  // ----------------------------------------------------------

  const updateInList = (list, updated) => {
    const index = list.findIndex((r) => r.id === updated.id)
    if (index !== -1) list[index] = updated
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    sentRequests,
    receivedRequests,
    request,
    loading,
    errors,

    fetchSentRequests,
    fetchReceivedRequests,
    fetchRequest,
    storeRequest,
    approveRequest,
    rejectRequest,
    cancelRequest,
    clearErrors,
  }

})
