import { ref, watch } from 'vue'

// ============================================================
// useDebounce
// Delays updating a value until the user stops typing.
// Used in Browse.vue search input to avoid firing an API
// call on every keystroke.
//
// Usage:
// const { debounced } = useDebounce(searchInput, 400)
// watch(debounced, () => listingStore.fetchListings())
// ============================================================

export const useDebounce = (source, delay = 400) => {
  const debounced = ref(source.value)
  let timer = null

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  return { debounced }
}
