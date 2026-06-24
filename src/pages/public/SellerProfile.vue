<template>
  <section class="container section space-y-6">
    <div v-if="loading" class="card space-y-4">
      <div class="skeleton h-24 rounded-xl" />
      <div class="skeleton h-8 w-1/3 rounded" />
    </div>

    <div v-else class="space-y-6">
      <div class="glass-card p-8">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-text-1">{{ seller?.name || 'Seller profile' }}</h1>
            <div v-if="totalReviews > 0" class="mt-2 flex items-center gap-2">
              <RatingStars :model-value="averageRating" show-value />
              <span class="text-sm text-text-3">({{ totalReviews }} reviews)</span>
            </div>
            <p class="mt-3 text-lg text-text-2">Listings and reviews shared by this seller.</p>
          </div>
          <div
            class="rounded-full border border-border bg-surface-3/70 px-3 py-2 text-sm text-text-2"
          >
            {{ sellerListings.length }} listing{{ sellerListings.length === 1 ? '' : 's' }}
          </div>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div class="card space-y-4">
          <h2 class="text-2xl font-semibold">Listings</h2>
          <div v-if="sellerListings.length === 0" class="text-sm text-text-2">
            No active listings yet.
          </div>
          <div v-else class="space-y-3">
            <article
              v-for="listing in sellerListings"
              :key="listing.id"
              class="rounded-xl border border-border bg-surface-3/60 p-4"
            >
              <div class="flex items-center justify-between gap-4">
                <h3 class="font-semibold text-text-1">{{ listing.title }}</h3>
                <span class="text-sm font-semibold text-accent">{{
                  formatPrice(listing.price)
                }}</span>
              </div>
              <p class="mt-2 text-sm text-text-2">{{ listing.condition }}</p>
            </article>
          </div>
        </div>

        <div class="card space-y-4">
          <h2 class="text-2xl font-semibold">Reviews</h2>
          <div v-if="reviews.length === 0" class="text-sm text-text-2">No reviews yet.</div>
          <div v-else class="space-y-3">
            <ReviewCard
              v-for="review in reviews"
              :key="review.id"
              :review="review"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useListingStore } from '@/stores/useListingStore'
import { formatPrice } from '@/utils/formatters'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'
import ReviewCard from '@/components/reviews/ReviewCard.vue'
import RatingStars from '@/components/reviews/RatingStars.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const listingStore = useListingStore()
const seller = ref(null)
const reviews = ref([])
const averageRating = ref(0)
const totalReviews = ref(0)
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const [{ data: sellerData }, { data: reviewData }] = await Promise.all([
      api.get(API.LISTINGS.SELLER(props.id || route.params.id), { params: { t: Date.now() } }),
      api.get(API.REVIEWS.SELLER(props.id || route.params.id), { params: { t: Date.now() } }),
    ])
    seller.value = sellerData.user || null
    listingStore.sellerListings = sellerData.listings || []
    reviews.value = reviewData.reviews || reviewData || []
    averageRating.value = reviewData.average_rating || 0
    totalReviews.value = reviewData.total_reviews || 0
  } finally {
    loading.value = false
  }
})

const sellerListings = computed(() => listingStore.sellerListings)
</script>
