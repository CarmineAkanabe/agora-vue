<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">Create listing</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">List an item for sale</h1>
      <p class="mt-3 text-lg text-text-2">
        Share a verified listing with students and keep your inventory up to date.
      </p>
    </div>

    <div class="card p-6">
      <ListingForm @submitted="handleSubmitted" @cancel="goBack" />
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ListingForm from '@/components/listings/ListingForm.vue'

const router = useRouter()

const handleSubmitted = () => {
  router.push({ name: 'my-listings' })
}

const goBack = () => {
  router.back()
}
</script>
