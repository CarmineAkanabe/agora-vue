import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

// ============================================================
// Agora — Formatters
// Pure functions. No side effects. No imports from stores.
// Use these everywhere dates, numbers, and currency appear.
// ============================================================

// ============================================================
// Currency
// All amounts in the app are XAF (Central African Franc).
// ============================================================

/**
 * Format a number as XAF currency.
 * @param {number|string} amount
 * @returns {string} e.g. "150 000 XAF"
 */
export const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return '—'

  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

/**
 * Format a number with thousand separators only (no currency symbol).
 * Use when you want to display the number inline with "XAF" separately.
 * @param {number|string} amount
 * @returns {string} e.g. "150 000"
 */
export const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '—'

  return new Intl.NumberFormat('fr-CM').format(Number(amount))
}

// ============================================================
// Dates
// ============================================================

/**
 * Format a date as a full readable string.
 * @param {string|Date} date
 * @returns {string} e.g. "January 15, 2025 at 10:30 AM"
 */
export const formatDate = (date) => {
  if (!date) return '—'
  return dayjs(date).format('MMMM D, YYYY [at] h:mm A')
}

/**
 * Format a date as a short string.
 * @param {string|Date} date
 * @returns {string} e.g. "Jan 15, 2025"
 */
export const formatDateShort = (date) => {
  if (!date) return '—'
  return dayjs(date).format('MMM D, YYYY')
}

/**
 * Format a date as relative time from now.
 * @param {string|Date} date
 * @returns {string} e.g. "2 hours ago" or "in 3 days"
 */
export const formatRelative = (date) => {
  if (!date) return '—'
  return dayjs(date).fromNow()
}

/**
 * Format a date for display in notification lists.
 * Shows relative time if within 7 days, otherwise short date.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatNotificationDate = (date) => {
  if (!date) return '—'
  const d = dayjs(date)
  const diffDays = dayjs().diff(d, 'day')
  return diffDays < 7 ? d.fromNow() : d.format('MMM D, YYYY')
}

/**
 * Format a countdown — time remaining until a future date.
 * Used for the 2-hour payment window on approved requests.
 * Returns null if the date is in the past.
 * @param {string|Date} date
 * @returns {string|null} e.g. "1h 23m remaining" or null
 */
export const formatCountdown = (date) => {
  if (!date) return null

  const target = dayjs(date)
  const now = dayjs()

  if (target.isBefore(now)) return null

  const totalMinutes = target.diff(now, 'minute')
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours > 0) return `${hours}h ${minutes}m remaining`
  if (minutes > 0) return `${minutes}m remaining`
  return 'Expiring soon'
}

/**
 * Check if a date is in the past.
 * @param {string|Date} date
 * @returns {boolean}
 */
export const isPast = (date) => {
  if (!date) return false
  return dayjs(date).isBefore(dayjs())
}

// ============================================================
// Ratings
// ============================================================

/**
 * Format a rating number to one decimal place.
 * @param {number|string|null} rating
 * @returns {string} e.g. "4.8" or "—"
 */
export const formatRating = (rating) => {
  if (rating === null || rating === undefined) return '—'
  return Number(rating).toFixed(1)
}

/**
 * Convert a rating (1-5) to an array for rendering star icons.
 * @param {number} rating
 * @returns {Array} Array of 5 objects: { filled: boolean }
 */
export const ratingToStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => ({
    filled: i < Math.round(rating),
  }))
}

// ============================================================
// Text
// ============================================================

/**
 * Truncate a string to a maximum length and append ellipsis.
 * @param {string} text
 * @param {number} max
 * @returns {string}
 */
export const truncate = (text, max = 100) => {
  if (!text) return ''
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}

/**
 * Capitalize the first letter of a string.
 * @param {string} text
 * @returns {string}
 */
export const capitalize = (text) => {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * Generate initials from a full name (up to 2 letters).
 * Used in Avatar.vue when no profile picture is set.
 * @param {string} name
 * @returns {string} e.g. "Alice Mboua" → "AM"
 */
export const getInitials = (name) => {
  if (!name) return '?'
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n.charAt(0).toUpperCase())
    .join('')
}

// ============================================================
// Files
// ============================================================

/**
 * Format a file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string} e.g. "1.4 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

/**
 * Check if a file is a valid image type.
 * @param {File} file
 * @returns {boolean}
 */
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif']
  return validTypes.includes(file?.type)
}

/**
 * Check if a file exceeds a size limit.
 * @param {File} file
 * @param {number} maxMB — max size in megabytes
 * @returns {boolean}
 */
export const exceedsSize = (file, maxMB = 2) => {
  return file?.size > maxMB * 1024 * 1024
}
