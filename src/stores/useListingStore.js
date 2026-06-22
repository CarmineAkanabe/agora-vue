import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import api, { multipart } from '@/plugins/axios'
import { API } from '@/utils/constants'

// ============================================================
// Agora — Listing Store
// Handles browsing, creating, updating, and deleting listings.
// ============================================================

export const useListingStore = defineStore('listing', () => {

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const listings     = ref([])
  const listing      = ref(null)
  const myListings   = ref([])
  const sellerListings = ref([])

  const meta = reactive({
    current_page: 1,
    last_page:    1,
    per_page:     12,
    total:        0,
  })

  const filters = reactive({
    'filter[category_id]': null,
    'filter[condition]':   null,
    'filter[title]':       null,
    'filter[price_between]': null,
    sort: '-created_at',
    page: 1,
  })

  const loading = ref(false)
  const errors  = ref({})

  // ----------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------

  const clearErrors = () => { errors.value = {} }

  const resetFilters = () => {
    filters['filter[category_id]']    = null
    filters['filter[condition]']      = null
    filters['filter[title]']          = null
    filters['filter[price_between]']  = null
    filters.sort = '-created_at'
    filters.page = 1
  }

  /**
   * Build query params from filters, stripping null values.
   */
  const buildParams = () => {
    return Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== null && v !== '')
    )
  }

  // ----------------------------------------------------------
  // Actions — Public
  // ----------------------------------------------------------

  const fetchListings = async () => {
    loading.value = true

    try {
      const { data } = await api.get(API.LISTINGS.INDEX, { params: buildParams() })
      listings.value = data.data
      Object.assign(meta, data.meta)
    } catch (error) {
      console.error('[ListingStore] fetchListings:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchListing = async (id) => {
    loading.value = true
    listing.value = null

    try {
      const { data } = await api.get(API.LISTINGS.SHOW(id))
      listing.value = data
    } catch (error) {
      console.error('[ListingStore] fetchListing:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchSellerListings = async (userId) => {
    loading.value = true
    sellerListings.value = []

    try {
      const { data } = await api.get(API.LISTINGS.SELLER(userId))
      sellerListings.value = data
    } catch (error) {
      console.error('[ListingStore] fetchSellerListings:', error)
    } finally {
      loading.value = false
    }
  }

  // ----------------------------------------------------------
  // Actions — Authenticated
  // ----------------------------------------------------------

  const fetchMyListings = async () => {
    loading.value = true
    myListings.value = []

    try {
      const { data } = await api.get(API.LISTINGS.INDEX, {
        params: { 'filter[mine]': true }
      })
      myListings.value = data.data ?? data
    } catch (error) {
      console.error('[ListingStore] fetchMyListings:', error)
    } finally {
      loading.value = false
    }
  }

  const storeListing = async (payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(
        API.LISTINGS.STORE,
        multipart(payload),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
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

  const updateListing = async (id, payload) => {
    loading.value = true
    clearErrors()

    try {
      const { data } = await api.post(
        API.LISTINGS.UPDATE(id),
        multipart(payload),
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      listing.value = data
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

  const destroyListing = async (id) => {
    loading.value = true

    try {
      await api.delete(API.LISTINGS.DESTROY(id))
      myListings.value = myListings.value.filter((l) => l.id !== id)
    } catch (error) {
      console.error('[ListingStore] destroyListing:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const toggleStatus = async (id) => {
    try {
      const { data } = await api.post(API.LISTINGS.TOGGLE_STATUS(id))
      const index = myListings.value.findIndex((l) => l.id === id)
      if (index !== -1) myListings.value[index] = data
      return data
    } catch (error) {
      console.error('[ListingStore] toggleStatus:', error)
      throw error
    }
  }

  // ----------------------------------------------------------
  // Actions — Images
  // ----------------------------------------------------------

  const addImages = async (listingId, images) => {
    try {
      const form = new FormData()
      images.forEach((img) => form.append('images[]', img))
      const { data } = await api.post(
        API.LISTING_IMAGES.STORE(listingId),
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      return data
    } catch (error) {
      console.error('[ListingStore] addImages:', error)
      throw error
    }
  }

  const deleteImage = async (listingId, imageId) => {
    try {
      await api.delete(API.LISTING_IMAGES.DESTROY(listingId, imageId))
      if (listing.value) {
        listing.value.images = listing.value.images.filter((img) => img.id !== imageId)
      }
    } catch (error) {
      console.error('[ListingStore] deleteImage:', error)
      throw error
    }
  }

  const setPrimaryImage = async (listingId, imageId) => {
    try {
      const { data } = await api.post(API.LISTING_IMAGES.SET_PRIMARY(listingId, imageId))
      if (listing.value) {
        listing.value.images = listing.value.images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
        listing.value.primary_image = data
      }
      return data
    } catch (error) {
      console.error('[ListingStore] setPrimaryImage:', error)
      throw error
    }
  }

  // ----------------------------------------------------------
  // Expose
  // ----------------------------------------------------------

  return {
    listings,
    listing,
    myListings,
    sellerListings,
    meta,
    filters,
    loading,
    errors,

    fetchListings,
    fetchListing,
    fetchSellerListings,
    fetchMyListings,
    storeListing,
    updateListing,
    destroyListing,
    toggleStatus,
    addImages,
    deleteImage,
    setPrimaryImage,
    resetFilters,
    clearErrors,
  }

})
