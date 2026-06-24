<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-accent">Marketplace</p>
          <h1 class="mt-2 text-3xl font-bold text-text-1">Browse listings</h1>
        </div>
        <p class="max-w-xl text-sm text-text-2">
          Browse verified student listings, filter by category or condition, and jump into the
          detail view when you find something you want.
        </p>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[280px_1fr]">
      <FilterSidebar
        :categories="categories"
        :filters="listingStore.filters"
        :search-query="searchQuery"
        :loading="listingStore.loading"
        @update:search-query="handleSearch"
        @update:filters="updateFilters"
        @reset-filters="resetFilters"
      />

      <div class="space-y-4">
        <ListingGrid :listings="listingStore.listings" :loading="listingStore.loading" />

        <div v-if="listingStore.meta.last_page > 1" class="flex flex-wrap justify-center gap-2">
          <button
            v-for="page in listingStore.meta.last_page"
            :key="page"
            class="btn btn-secondary btn-sm"
            :class="{ 'btn-primary': page === listingStore.meta.current_page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useListingStore } from '@/stores/useListingStore'
import { useDebounce } from '@/composables/useDebounce'
import FilterSidebar from '@/components/listings/FilterSidebar.vue'
import ListingGrid from '@/components/listings/ListingGrid.vue'

const categoryStore = useCategoryStore()
const listingStore = useListingStore()
const searchQuery = ref('')

onMounted(async () => {
  await categoryStore.fetchCategories()
  await listingStore.fetchListings()
})

const categories = computed(() => categoryStore.categories)

const applyFilters = async () => {
  listingStore.filters.page = 1
  await listingStore.fetchListings()
}

const updateFilters = async (nextFilters) => {
  Object.assign(listingStore.filters, nextFilters)
  await applyFilters()
}

const handleSearch = (value) => {
  searchQuery.value = value
  setValue(value)
}

const resetFilters = async () => {
  listingStore.resetFilters()
  searchQuery.value = ''
  await listingStore.fetchListings()
}

const goToPage = async (page) => {
  listingStore.filters.page = page
  await listingStore.fetchListings()
}

const { debouncedValue: debouncedSearch, setValue } = useDebounce(searchQuery, 300)
watch(debouncedSearch, async (value) => {
  listingStore.filters['filter[title]'] = value || null
  listingStore.filters.page = 1
  await listingStore.fetchListings()
})
</script>
