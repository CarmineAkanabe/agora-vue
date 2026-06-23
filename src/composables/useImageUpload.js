import { ref } from 'vue'
import { isValidImage, exceedsSize, formatFileSize } from '@/utils/formatters'

// ============================================================
// useImageUpload
// Handles file selection, preview generation, validation,
// and primary image selection for listing forms.
//
// Usage:
// const { files, previews, primaryIndex, addFiles,
//         removeFile, setPrimary, errors } = useImageUpload()
// ============================================================

export const useImageUpload = (maxFiles = 5, maxMB = 2) => {

  const files        = ref([])   // raw File objects
  const previews     = ref([])   // object URL strings for <img> src
  const primaryIndex = ref(0)    // index of the primary image
  const errors       = ref([])   // per-file error messages

  // ----------------------------------------------------------
  // Add files from an input event or drop event
  // ----------------------------------------------------------

  const addFiles = (incoming) => {
    errors.value = []
    const newFiles = Array.from(incoming)

    for (const file of newFiles) {
      if (files.value.length >= maxFiles) {
        errors.value.push(`Maximum ${maxFiles} images allowed.`)
        break
      }

      if (!isValidImage(file)) {
        errors.value.push(`${file.name}: Invalid file type. Use JPEG, PNG, or WebP.`)
        continue
      }

      if (exceedsSize(file, maxMB)) {
        errors.value.push(`${file.name}: Exceeds ${maxMB}MB limit (${formatFileSize(file.size)}).`)
        continue
      }

      files.value.push(file)
      previews.value.push(URL.createObjectURL(file))
    }
  }

  // ----------------------------------------------------------
  // Remove a file by index
  // ----------------------------------------------------------

  const removeFile = (index) => {
    URL.revokeObjectURL(previews.value[index])
    files.value.splice(index, 1)
    previews.value.splice(index, 1)

    // Adjust primary index if needed
    if (primaryIndex.value >= files.value.length) {
      primaryIndex.value = Math.max(0, files.value.length - 1)
    }
  }

  // ----------------------------------------------------------
  // Set primary image
  // ----------------------------------------------------------

  const setPrimary = (index) => {
    primaryIndex.value = index
  }

  // ----------------------------------------------------------
  // Clear everything (after successful form submit)
  // ----------------------------------------------------------

  const reset = () => {
    previews.value.forEach((url) => URL.revokeObjectURL(url))
    files.value        = []
    previews.value     = []
    primaryIndex.value = 0
    errors.value       = []
  }

  // ----------------------------------------------------------
  // Check if ready (at least one file selected, no errors)
  // ----------------------------------------------------------

  const isReady = () => files.value.length > 0 && errors.value.length === 0

  return {
    files,
    previews,
    primaryIndex,
    errors,
    addFiles,
    removeFile,
    setPrimary,
    reset,
    isReady,
  }
}
