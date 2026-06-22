import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Transaction Store
// Handles payment initiation, polling, and pickup code.
// ============================================================

export const useTransactionStore = defineStore('transaction', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const transactions  = ref([])
  const transaction   = ref(null)
  const loading       = ref(false)
  const errors        = ref({})

  // Polling state
  const polling       = ref(false)
  let   pollingTimer  = null

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const clearErrors = () => { errors.value = {} }

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  const fetchTransactions = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.TRANSACTIONS.INDEX)
      transactions.value = data
    } catch (error) {
      console.error('[TransactionStore] fetchTransactions:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchTransaction = async (id) => {
    loading.value = true
    transaction.value = null

    try {
      const { data } = await api.get(API.TRANSACTIONS.SHOW(id))
      transaction.value = data
    } catch (error) {
      console.error('[TransactionStore] fetchTransaction:', error)
    } finally {
      loading.value = false
    }
  }

  const initiatePayment = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.TRANSACTIONS.STORE, payload)
      transaction.value = data
      transactions.value.unshift(data)

      // Start polling immediately after initiation
      startPolling(data.id)

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

  const verifyPickupCode = async (transactionId, code) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.PICKUP_CODE.VERIFY(transactionId), { code })
      transaction.value = data.transaction
      updateInList(transactions.value, data.transaction)
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

  // ----------------------------------------------------------
  // Polling
  // The backend handles the real polling via PollPaymentStatusJob.
  // This frontend polling just refreshes the transaction state
  // so the UI reacts when the backend updates the status.
  // Stops automatically when status leaves 'initiated'.
  // ----------------------------------------------------------

  const startPolling = (id, intervalMs = 5000) => {
    stopPolling()
    polling.value = true

    pollingTimer = setInterval(async () => {
      try {
        const { data } = await api.get(API.TRANSACTIONS.SHOW(id))
        transaction.value = data
        updateInList(transactions.value, data)

        // Stop polling once status moves past 'initiated'
        if (data.status !== 'initiated') {
          stopPolling()
        }
      } catch {
        stopPolling()
      }
    }, intervalMs)
  }

  const stopPolling = () => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
    polling.value = false
  }

  // ----------------------------------------------------------
  // Helper
  // ----------------------------------------------------------

  const updateInList = (list, updated) => {
    const index = list.findIndex((t) => t.id === updated.id)
    if (index !== -1) list[index] = updated
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    transactions,
    transaction,
    loading,
    errors,
    polling,

    fetchTransactions,
    fetchTransaction,
    initiatePayment,
    verifyPickupCode,
    startPolling,
    stopPolling,
    clearErrors,
  }

})
