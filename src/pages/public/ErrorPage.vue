<template>
  <section class="container section min-h-[60vh] flex items-center justify-center">
    <div class="card p-10 max-w-lg w-full text-center space-y-6">
      <div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-danger/10 text-danger mb-4">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      
      <div>
        <h1 class="text-3xl font-bold text-text-1 mb-2">{{ title }}</h1>
        <p class="text-lg text-text-2">{{ message }}</p>
      </div>
      
      <div class="pt-4 border-t border-border mt-6">
        <button class="btn btn-primary w-full" @click="$router.back()">
          Go Back
        </button>
        <router-link :to="{ name: 'home' }" class="btn btn-ghost w-full mt-2">
          Return to Home
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const title = computed(() => route.query.title || 'An Error Occurred')
const message = computed(() => route.query.message || 'We encountered an unexpected problem. Please try again later.')
</script>
