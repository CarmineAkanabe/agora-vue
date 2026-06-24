<template>
  <section class="container section space-y-6">
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Student</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">My Reviews</h1>
        <p class="mt-2 text-lg text-text-2">
          View feedback and ratings from your previous buyers.
        </p>
      </div>
      <div v-if="!loading && reviewStore.totalReviews > 0" class="flex items-center gap-2">
        <RatingStars :model-value="reviewStore.averageRating" show-value />
        <span class="text-sm text-text-3">({{ reviewStore.totalReviews }} reviews)</span>
      </div>
    </div>

    <div v-if="loading" class="card p-6 space-y-4">
      <div class="skeleton h-24 w-full rounded" />
      <div class="skeleton h-24 w-full rounded" />
    </div>

    <div v-else>
      <div v-if="reviewStore.reviews.length" class="space-y-4">
        <div v-for="review in reviewStore.reviews" :key="review.id" class="card p-5">
           <div class="flex items-center justify-between mb-3">
             <div class="flex items-center gap-3">
               <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-sm">
                 {{ getInitials(review.buyer?.name) }}
               </div>
               <div>
                 <p class="font-semibold text-text-1">{{ review.buyer?.name || 'Anonymous Buyer' }}</p>
                 <p class="text-xs text-text-3">{{ formatDateShort(review.created_at) }}</p>
               </div>
             </div>
             <RatingStars :model-value="review.rating" :interactive="false" />
           </div>
           
           <div class="bg-surface-3/50 p-4 rounded-lg border border-border mt-3">
             <p v-if="review.comment" class="text-text-2 text-sm italic">"{{ review.comment }}"</p>
             <p v-else class="text-text-3 text-sm italic">No comment provided.</p>
           </div>
           
           <!-- Context link to transaction/listing -->
           <div class="mt-4 flex items-center gap-2 text-xs text-text-3 border-t border-border pt-3">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
               <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
             </svg>
             <router-link v-if="review.transaction_id" :to="{ name: 'transaction-detail', params: { id: review.transaction_id } }" class="text-primary hover:underline">
               View associated transaction
             </router-link>
           </div>
        </div>
      </div>
      <div v-else class="card p-8 text-center">
        <svg class="mx-auto h-12 w-12 text-text-3 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <h3 class="text-lg font-semibold text-text-1">No reviews yet</h3>
        <p class="text-sm text-text-2 mt-1">You haven't received any reviews from buyers yet.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useReviewStore } from '@/stores/useReviewStore'
import RatingStars from '@/components/reviews/RatingStars.vue'
import { getInitials, formatDateShort } from '@/utils/formatters'

const auth = useAuthStore()
const reviewStore = useReviewStore()
const loading = ref(true)

onMounted(async () => {
  if (auth.user?.id) {
    await reviewStore.fetchSellerReviews(auth.user.id)
  }
  loading.value = false
})
</script>
