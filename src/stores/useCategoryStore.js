import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Category Store
// Categories rarely change — fetched once and reused.
// ============================================================

export const useCategoryStore = defineStore('category', () => {

  const categories = ref([])
  const loading    = ref(false)

  const fetchCategories = async () => {
    // Don't re-fetch if already loaded
    if (categories.value.length > 0) return

    loading.value = true

    try {
      const { data } = await api.get(API.CATEGORIES.INDEX)
      categories.value = data
    } catch (error) {
      console.error('[CategoryStore] fetchCategories:', error)
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories }

})
