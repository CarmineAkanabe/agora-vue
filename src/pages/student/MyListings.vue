<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm uppercase tracking-[0.3em] text-accent">My listings</p>
          <h1 class="mt-2 text-3xl font-bold text-text-1">Manage your items</h1>
        </div>
        <router-link :to="{ name: 'create-listing' }" class="btn btn-primary"
          >Create listing</router-link
        >
      </div>
    </div>

    <div v-if="loading" class="card p-6 space-y-4">
      <div class="skeleton h-8 w-1/3 rounded" />
      <div class="skeleton h-20 rounded-xl" />
    </div>

    <div v-else-if="listingStore.myListings.length" class="space-y-4">
      <div v-for="listing in listingStore.myListings" :key="listing.id" class="card p-6">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-text-1">{{ listing.title }}</h2>
            <p class="mt-2 text-sm text-text-2">
              {{ listing.description || 'No description provided.' }}
            </p>
          </div>
          <div class="flex flex-wrap gap-2">
            <router-link
              :to="{ name: 'edit-listing', params: { id: listing.id } }"
              class="btn btn-secondary btn-sm"
            >
              Edit
            </router-link>
            <button class="btn btn-ghost btn-sm" @click="toggleStatus(listing.id)">
              {{ listing.status === 'active' ? 'Pause' : 'Activate' }}
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete(listing.id)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card p-6 text-text-2">You do not have any listings yet.</div>

    <Modal
      v-model="confirmState.open"
      :title="confirmState.title"
      :message="confirmState.message"
      variant="danger"
      show-actions
      :loading="confirmState.loading"
      @confirm="handleConfirm"
    />
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useListingStore } from '@/stores/useListingStore'
import Modal from '@/components/ui/Modal.vue'

const listingStore = useListingStore()
const loading = ref(true)
const confirmState = reactive({
  open: false,
  title: '',
  message: '',
  loading: false,
  id: null,
})

onMounted(async () => {
  await listingStore.fetchMyListings()
  loading.value = false
})

const confirmDelete = (id) => {
  confirmState.id = id
  confirmState.title = 'Delete listing'
  confirmState.message = 'This listing will be removed from the marketplace.'
  confirmState.loading = false
  confirmState.open = true
}

const handleConfirm = async () => {
  if (!confirmState.id) return
  confirmState.loading = true
  try {
    await listingStore.destroyListing(confirmState.id)
  } finally {
    confirmState.loading = false
    confirmState.open = false
    confirmState.id = null
  }
}

const toggleStatus = async (id) => {
  await listingStore.toggleStatus(id)
}
</script>
