import axios from 'axios'
import { STORAGE_KEYS } from '@/utils/constants'

// ============================================================
// Agora API — Axios Instance
// All API calls go through this instance.
// Never import axios directly in stores or services.
// Always import this file instead.
// ============================================================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
})

// ============================================================
// Request Interceptor
// Attaches Bearer token to every request automatically.
// ============================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ============================================================
// Response Interceptor
// Handles global error cases before they reach the store.
// ============================================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status

    // Unauthenticated — token expired or invalid
    // Clear storage and redirect to login
    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.USER)
      window.location.href = '/login'
      return Promise.reject(error)
    }

    // Banned or unverified — let the store/component handle this
    // We just pass it through with the status intact
    if (status === 403) {
      return Promise.reject(error)
    }

    // Validation errors — pass through so forms can display field errors
    if (status === 422) {
      return Promise.reject(error)
    }

    // Rate limited
    if (status === 429) {
      return Promise.reject(error)
    }

    // Server error
    if (status === 500) {
      console.error('[Agora API] Server error:', error.response?.data)
      return Promise.reject(error)
    }

    return Promise.reject(error)
  }
)

// ============================================================
// Multipart helper
// Use this for any request that includes file uploads.
// Overrides Content-Type to multipart/form-data automatically.
// ============================================================

export const multipart = (data) => {
  const form = new FormData()

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => form.append(`${key}[]`, item))
    } else if (value !== null && value !== undefined) {
      form.append(key, value)
    }
  })

  return form
}

export default api
