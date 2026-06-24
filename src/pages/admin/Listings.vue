<template>
  <section class="space-y-6">
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Platform Listings</h1>
        <p class="mt-2 text-lg text-text-2">
          Monitor and moderate active marketplace listings.
        </p>
      </div>
    </div>

    <div class="card p-0 overflow-hidden flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="border-b border-border bg-surface-2 text-xs uppercase tracking-wider text-text-3">
              <th class="p-4 font-medium">Listing Title</th>
              <th class="p-4 font-medium">Seller</th>
              <th class="p-4 font-medium">Price</th>
              <th class="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="loading">
              <tr v-for="i in 5" :key="i" class="border-b border-border">
                <td class="p-4"><div class="skeleton h-5 w-3/4 rounded" /></td>
                <td class="p-4"><div class="skeleton h-5 w-1/2 rounded" /></td>
                <td class="p-4"><div class="skeleton h-5 w-1/4 rounded" /></td>
                <td class="p-4 flex justify-end"><div class="skeleton h-8 w-20 rounded" /></td>
              </tr>
            </template>
            <template v-else-if="listings.length === 0">
              <tr>
                <td colspan="4" class="p-12 text-center text-text-3">
                  No active listings found.
                </td>
              </tr>
            </template>
            <template v-else>
              <tr 
                v-for="listing in listings" 
                :key="listing.id"
                class="border-b border-border last:border-0 hover:bg-surface-3/50 transition-colors"
              >
                <td class="p-4">
                  <p class="text-sm font-medium text-text-1 truncate max-w-[250px]">{{ listing.title }}</p>
                  <p class="text-xs text-text-3 mt-1">{{ listing.condition }}</p>
                </td>
                <td class="p-4">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-text-2">{{ listing.user?.name || 'Unknown' }}</span>
                  </div>
                </td>
                <td class="p-4">
                  <span class="text-sm font-semibold text-text-1">{{ formatPrice(listing.price) }}</span>
                </td>
                <td class="p-4 text-right">
                  <Button variant="danger" size="sm" @click="confirmRemove(listing)">
                    Remove
                  </Button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="listingsMeta && listingsMeta.last_page > 1" class="p-4 border-t border-border flex justify-between items-center bg-surface-2">
        <Button 
          variant="secondary" 
          size="sm" 
          :disabled="listingsMeta.current_page === 1"
          @click="adminStore.fetchListings(listingsMeta.current_page - 1)"
        >
          Previous
        </Button>
        <span class="text-sm text-text-3">Page {{ listingsMeta.current_page }} of {{ listingsMeta.last_page }}</span>
        <Button 
          variant="secondary" 
          size="sm" 
          :disabled="listingsMeta.current_page === listingsMeta.last_page"
          @click="adminStore.fetchListings(listingsMeta.current_page + 1)"
        >
          Next
        </Button>
      </div>
    </div>

    <!-- Remove Modal -->
    <Modal
      v-model="showRemoveModal"
      title="Remove Listing"
      variant="danger"
      show-actions
      confirm-label="Remove"
      :loading="isRemoving"
      @confirm="handleRemove"
    >
      <p class="text-text-2 mb-4">
        Are you sure you want to remove the listing <strong>"{{ selectedListing?.title }}"</strong>? This action cannot be undone.
      </p>
      <UiTextarea
        v-model="removeReason"
        label="Reason for removal (optional)"
        placeholder="Explain why this listing violates policies..."
        :rows="3"
      />
    </Modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatPrice } from '@/utils/formatters'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import UiTextarea from '@/components/ui/Textarea.vue'

const adminStore = useAdminStore()

const listings = computed(() => adminStore.listings)
const listingsMeta = computed(() => adminStore.listingsMeta)
const loading = computed(() => adminStore.loading)

const showRemoveModal = ref(false)
const selectedListing = ref(null)
const removeReason = ref('')
const isRemoving = ref(false)

onMounted(() => {
  adminStore.fetchListings(1)
})

const confirmRemove = (listing) => {
  selectedListing.value = listing
  removeReason.value = ''
  showRemoveModal.value = true
}

const handleRemove = async () => {
  if (!selectedListing.value) return
  isRemoving.value = true
  try {
    await adminStore.removeListing(selectedListing.value.id, removeReason.value)
    showRemoveModal.value = false
  } catch (error) {
    console.error('Failed to remove listing', error)
  } finally {
    isRemoving.value = false
  }
}
</script>
