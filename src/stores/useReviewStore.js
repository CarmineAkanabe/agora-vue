import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Review Store
// Handles creating reviews and fetching seller reviews.
// ============================================================

export const useReviewStore = defineStore('review', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const reviews       = ref([])
  const averageRating = ref(null)
  const totalReviews  = ref(0)
  const loading       = ref(false)
  const errors        = ref({})

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const clearErrors = () => { errors.value = {} }

  // ----------------------------------------------------------
  // Actions
  // ----------------------------------------------------------

  /**
   * Fetch reviews for a specific seller.
   * GET /reviews/seller/{userId}
   * Response shape: { average_rating, total_reviews, reviews: [...] }
   */
  const fetchSellerReviews = async (userId) => {
    loading.value = true

    try {
      const { data } = await api.get(API.REVIEWS.SELLER(userId))
      reviews.value       = data.reviews ?? data ?? []
      averageRating.value = data.average_rating ?? null
      totalReviews.value  = data.total_reviews ?? 0
    } catch (error) {
      console.error('[ReviewStore] fetchSellerReviews:', error)
    } finally {
      loading.value = false
    }
  }

  /**
   * Submit a new review.
   * POST /reviews
   * Body: { transaction_id, rating, comment }
   */
  const storeReview = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(API.REVIEWS.STORE, payload)
      reviews.value.unshift(data)
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
  // Expose
  // ----------------------------------------------------------

  return {
    reviews,
    averageRating,
    totalReviews,
    loading,
    errors,

    fetchSellerReviews,
    storeReview,
    clearErrors,
  }

})
