import { ref, watch } from 'vue'

// ============================================================
// useDebounce
// Delays updating a value until the user stops typing.
// Used in Browse.vue search input to avoid firing an API
// call on every keystroke.
// ============================================================

export const useDebounce = (source, delay = 400) => {
  const debouncedValue = ref(source.value)
  let timer = null

  const setValue = (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debouncedValue.value = value
    }, delay)
  }

  watch(
    source,
    (value) => {
      setValue(value)
    },
    { immediate: true },
  )

  return { debouncedValue, setValue }
}
