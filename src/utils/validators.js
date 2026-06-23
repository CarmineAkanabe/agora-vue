// ============================================================
// Agora - Validators
// Pure validation helpers. Return true when valid, otherwise
// return a short user-facing error message.
// ============================================================

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  return false
}

export const required = (value, label = 'This field') => {
  return isEmpty(value) ? `${label} is required.` : true
}

export const email = (value, label = 'Email') => {
  if (isEmpty(value)) return true

  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(String(value).trim()) ? true : `${label} must be a valid email address.`
}

export const minLength = (value, min, label = 'This field') => {
  if (isEmpty(value)) return true
  return String(value).length >= min ? true : `${label} must be at least ${min} characters.`
}

export const sameAs = (value, match, label = 'This field') => {
  return value === match ? true : `${label} does not match.`
}

export const password = (value, label = 'Password') => {
  const requiredResult = required(value, label)
  if (requiredResult !== true) return requiredResult

  return minLength(value, 8, label)
}

export const passwordConfirmation = (value, original) => {
  const requiredResult = required(value, 'Password confirmation')
  if (requiredResult !== true) return requiredResult

  return sameAs(value, original, 'Password confirmation')
}

export const phone = (value, label = 'Phone number') => {
  if (isEmpty(value)) return true

  const normalized = String(value).replace(/[\s-]/g, '')
  const pattern = /^(?:\+?237)?6\d{8}$/

  return pattern.test(normalized)
    ? true
    : `${label} must be a valid Cameroon mobile number.`
}

export const matricule = (value, label = 'Matricule') => {
  if (isEmpty(value)) return true

  const pattern = /^[A-Za-z0-9-]{4,30}$/
  return pattern.test(String(value).trim())
    ? true
    : `${label} must contain 4 to 30 letters, numbers, or hyphens.`
}

export const numeric = (value, label = 'This field') => {
  if (isEmpty(value)) return true

  return Number.isFinite(Number(value)) ? true : `${label} must be a valid number.`
}

export const minNumber = (value, min, label = 'This field') => {
  if (isEmpty(value)) return true

  const numericResult = numeric(value, label)
  if (numericResult !== true) return numericResult

  return Number(value) >= min ? true : `${label} must be at least ${min}.`
}

export const positivePrice = (value, label = 'Price') => {
  const requiredResult = required(value, label)
  if (requiredResult !== true) return requiredResult

  return minNumber(value, 1, label)
}

export const positiveInteger = (value, label = 'Quantity') => {
  const requiredResult = required(value, label)
  if (requiredResult !== true) return requiredResult

  const number = Number(value)
  if (!Number.isInteger(number)) return `${label} must be a whole number.`

  return number >= 1 ? true : `${label} must be at least 1.`
}

export const pickupCode = (value, label = 'Pickup code') => {
  const requiredResult = required(value, label)
  if (requiredResult !== true) return requiredResult

  return /^\d{6}$/.test(String(value)) ? true : `${label} must be exactly 6 digits.`
}

export const rating = (value, label = 'Rating') => {
  const requiredResult = required(value, label)
  if (requiredResult !== true) return requiredResult

  const number = Number(value)
  return Number.isInteger(number) && number >= 1 && number <= 5
    ? true
    : `${label} must be between 1 and 5.`
}

export const imageType = (file, label = 'File') => {
  if (!file) return true

  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif']
  return validTypes.includes(file.type)
    ? true
    : `${label} must be a JPEG, PNG, GIF, or WebP image.`
}

export const imageSize = (file, maxMB = 2, label = 'File') => {
  if (!file) return true

  return file.size <= maxMB * 1024 * 1024
    ? true
    : `${label} must not exceed ${maxMB}MB.`
}

export const imageFile = (file, maxMB = 2, label = 'File') => {
  const typeResult = imageType(file, label)
  if (typeResult !== true) return typeResult

  return imageSize(file, maxMB, label)
}

export const firstError = (...results) => {
  return results.find((result) => result !== true) ?? true
}

export const validateFields = (schema, values) => {
  const errors = {}

  Object.entries(schema).forEach(([field, rules]) => {
    for (const rule of rules) {
      const result = rule(values[field], values)
      if (result !== true) {
        errors[field] = result
        break
      }
    }
  })

  return errors
}
