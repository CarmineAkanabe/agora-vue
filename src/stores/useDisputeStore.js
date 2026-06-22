import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Dispute Store
// ============================================================

export const useDisputeStore = defineStore('dispute', () => {

  const disputes = ref([])
  const dispute  = ref(null)
  const loading  = ref(false)
  const errors   = ref({})

  const clearErrors = () => { errors.value = {} }

  const fetchDisputes = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.DISPUTES.INDEX)
      disputes.value = data
    } catch (error) {
      console.error('[DisputeStore] fetchDisputes:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchDispute = async (id) => {
    loading.value = true
    dispute.value = null

    try {
      const { data } = await api.get(API.DISPUTES.SHOW(id))
      dispute.value = data
    } catch (error) {
      console.error('[DisputeStore] fetchDispute:', error)
    } finally {
      loading.value = false
    }
  }

  const storeDispute = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.DISPUTES.STORE, payload)
      disputes.value.unshift(data)
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

  return {
    disputes,
    dispute,
    loading,
    errors,

    fetchDisputes,
    fetchDispute,
    storeDispute,
    clearErrors,
  }

})
