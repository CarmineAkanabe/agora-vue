<template>
  <section class="container section space-y-8">
    <div class="glass-card p-8 md:p-10">
      <div class="max-w-2xl space-y-4">
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Verified campus marketplace</p>
        <h1 class="text-4xl md:text-5xl font-bold text-text-1">Buy and sell safely on campus.</h1>
        <p class="text-lg text-text-2">
          Agora connects verified students with a secure marketplace, simple request flow, and
          trusted profile checks.
        </p>
        <div class="flex flex-wrap gap-3 pt-2">
          <router-link :to="{ name: 'browse' }" class="btn btn-primary"
            >Browse listings</router-link
          >
          <router-link :to="{ name: 'about' }" class="btn btn-secondary">Learn more</router-link>
        </div>
      </div>
    </div>

    <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="card space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Popular categories</h2>
          <span class="text-sm text-text-3">{{ categories.length }} active</span>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="item in 4" :key="item" class="skeleton h-10 rounded-lg" />
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <span v-for="category in categories" :key="category.id" class="badge badge-primary">
            {{ category.name }}
          </span>
        </div>
      </div>

      <div class="card space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Fresh listings</h2>
          <router-link :to="{ name: 'browse' }" class="text-sm text-primary">View all</router-link>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="item in 3" :key="item" class="skeleton h-20 rounded-lg" />
        </div>
        <div v-else class="space-y-3">
          <article
            v-for="listing in listings"
            :key="listing.id"
            class="rounded-xl border border-border bg-surface-3/70 p-4"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="font-semibold text-text-1">{{ listing.title }}</h3>
                <p class="text-sm text-text-2">{{ listing.category?.name || 'General' }}</p>
              </div>
              <span class="text-sm font-semibold text-accent">{{
                formatPrice(listing.price)
              }}</span>
            </div>
            <div class="mt-3 flex items-center justify-between text-sm text-text-3">
              <span>{{ listing.condition }}</span>
              <router-link
                :to="{ name: 'listing-detail', params: { id: listing.id } }"
                class="text-primary"
                >View</router-link
              >
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useListingStore } from '@/stores/useListingStore'
import { formatPrice } from '@/utils/formatters'

const categoryStore = useCategoryStore()
const listingStore = useListingStore()

onMounted(async () => {
  await categoryStore.fetchCategories()
  await listingStore.fetchListings()
})

const categories = computed(() => categoryStore.categories)
const listings = computed(() => listingStore.listings.slice(0, 4))
const loading = computed(() => categoryStore.loading || listingStore.loading)
</script>
