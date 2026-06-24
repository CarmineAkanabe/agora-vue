import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Category Store
// Categories rarely change — fetched once and reused.
// ============================================================

export const useCategoryStore = defineStore('category', () => {

  const DEFAULT_CATEGORIES = [
    { id: 1, name: 'Electronics & Gadgets', slug: 'electronics' },
    { id: 2, name: 'Furniture', slug: 'furniture' },
    { id: 3, name: 'Books & Materials', slug: 'books' },
    { id: 4, name: 'Clothing & Accessories', slug: 'clothing' },
    { id: 5, name: 'Services', slug: 'services' },
  ]

  let initialCategories = DEFAULT_CATEGORIES
  try {
    const cached = localStorage.getItem('agora_categories')
    if (cached) {
      const parsed = JSON.parse(cached)
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialCategories = parsed
      }
    }
  } catch (e) {
    console.warn('Error parsing cached categories from localStorage:', e)
    initialCategories = DEFAULT_CATEGORIES
  }

  const categories = ref(initialCategories)
  const loading    = ref(false)

  const saveCategories = (cats) => {
    const currentCats = Array.isArray(categories.value) ? categories.value : []
    const existing = new Map(currentCats.map(c => [c.id, c]))
    cats.forEach(c => existing.set(c.id, c))
    const merged = Array.from(existing.values())
    categories.value = merged
    localStorage.setItem('agora_categories', JSON.stringify(merged))
  }

  const addCategory = (cat) => saveCategories([cat])

  const removeCategory = (id) => {
    const filtered = categories.value.filter(c => c.id !== id)
    categories.value = filtered
    localStorage.setItem('agora_categories', JSON.stringify(filtered))
  }

  const fetchCategories = async () => {
    loading.value = true

    try {
      const response = await api.get(API.CATEGORIES.INDEX)
      const payload = response.data
      
      console.log('[CategoryStore] API Response payload:', payload)
      
      let result = []
      if (Array.isArray(payload)) {
        result = payload
      } else if (payload && Array.isArray(payload.data)) {
        result = payload.data
      } else if (payload?.data && Array.isArray(payload.data.data)) {
        result = payload.data.data
      } else if (payload && typeof payload === 'object') {
        // Fallback: aggressively search the object for an array
        for (const key in payload) {
          if (Array.isArray(payload[key])) {
            result = payload[key]
            break
          }
        }
      }
      
      if (result.length > 0) {
        saveCategories(result)
      }
    } catch (error) {
      console.error('[CategoryStore] fetchCategories:', error)
    } finally {
      loading.value = false
    }
  }

  return { categories, loading, fetchCategories, saveCategories, addCategory, removeCategory }

})
