<template>
  <section class="container section">
    <div v-if="loading" class="card space-y-4">
      <div class="skeleton h-56 rounded-xl" />
      <div class="skeleton h-8 w-1/3 rounded" />
      <div class="skeleton h-6 w-2/3 rounded" />
    </div>

    <div v-else-if="listing" class="space-y-6">
      <div class="glass-card p-8">
        <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="space-y-4">
            <img
              v-if="primaryImage"
              :src="primaryImage"
              alt="Listing image"
              class="h-80 w-full rounded-2xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
              @click="openImageModal(primaryImage)"
            />
            <div
              v-else
              class="flex h-80 items-center justify-center rounded-2xl border border-border bg-surface-3 text-text-3"
            >
              No image available
            </div>
            <div v-if="listing.images?.length" class="flex flex-wrap gap-3">
              <img
                v-for="image in listing.images"
                :key="image.id"
                :src="image.url"
                alt="Listing thumbnail"
                class="h-20 w-20 rounded-lg object-cover border border-border cursor-pointer hover:opacity-90 transition-opacity"
                @click="openImageModal(image.url)"
              />
            </div>
          </div>

          <div class="space-y-5">
            <div>
              <p class="text-sm uppercase tracking-[0.3em] text-accent">
                {{ listing.category?.name || 'Listing' }}
              </p>
              <h1 class="mt-2 text-3xl font-bold text-text-1">{{ listing.title }}</h1>
              <p class="mt-3 text-lg text-text-2">
                {{ listing.description || 'No description provided yet.' }}
              </p>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <div class="card p-4">
                <p class="text-sm text-text-3">Price</p>
                <p class="mt-1 text-2xl font-semibold text-text-1">
                  {{ formatPrice(listing.price) }}
                </p>
              </div>
              <div class="card p-4">
                <p class="text-sm text-text-3">Quantity</p>
                <p class="mt-1 text-2xl font-semibold text-text-1">{{ listing.quantity ?? '—' }}</p>
              </div>
            </div>

            <div class="card p-4 space-y-2">
              <p><span class="text-text-3">Condition:</span> {{ displayCondition }}</p>
              <p>
                <span class="text-text-3">Seller:</span>
                <router-link
                  v-if="sellerId"
                  :to="{ name: 'seller-profile', params: { id: sellerId } }"
                  class="text-primary"
                >
                  {{ sellerName }}
                </router-link>
                <span v-else>{{ sellerName }}</span>
              </p>
              <p><span class="text-text-3">Status:</span> {{ listing.status || 'active' }}</p>
            </div>

            <div v-if="auth.isLoggedIn && auth.isVerified && !isOwnListing" class="card p-4">
              <h2 class="text-xl font-semibold">Request this item</h2>
              <p class="mt-2 text-sm text-text-2">
                You can send a purchase request to the seller from here.
              </p>
              <button
                class="btn btn-primary mt-4"
                @click="showRequestModal = true"
              >
                Send request
              </button>
            </div>

            <div v-else-if="auth.isLoggedIn && !auth.isVerified" class="card p-4">
              <p class="text-sm text-text-2">
                Verify your account before sending purchase requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card text-center py-12">
      <h2 class="text-2xl font-semibold">Listing not found</h2>
      <p class="mt-2 text-text-2">The listing you requested could not be loaded.</p>
    </div>

    <!-- Image Lightbox Modal -->
    <Modal v-model="showImageModal" :title="listing?.title" variant="default" closeOnOverlay>
      <img :src="selectedImage" alt="Fullscreen preview" class="w-full h-auto rounded-xl object-contain" />
    </Modal>

    <!-- Send Request Modal -->
    <SendRequestModal 
      v-if="listing" 
      v-model="showRequestModal" 
      :listing="listing" 
      @success="onRequestSuccess" 
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useListingStore } from '@/stores/useListingStore'
import { useRequestStore } from '@/stores/useRequestStore'
import { formatPrice } from '@/utils/formatters'
import Modal from '@/components/ui/Modal.vue'
import SendRequestModal from '@/components/requests/SendRequestModal.vue'
import { toast } from 'vue-sonner'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const listingStore = useListingStore()
const requestStore = useRequestStore()

const showImageModal = ref(false)
const selectedImage = ref('')
const showRequestModal = ref(false)

onMounted(async () => {
  const currentId = Number(props.id || route.params.id)
  await listingStore.fetchListing(currentId)

  // Fallback: If listing not found (e.g., hidden after request approval),
  // but we arrived from the request details page with cached listing data,
  // we manually populate it to prevent the "Listing not found" error.
  if (!listingStore.listing && requestStore.request?.listing?.id === currentId) {
    listingStore.listing = requestStore.request.listing
  }
})

const listing = computed(() => listingStore.listing)
const loading = computed(() => listingStore.loading)
const primaryImage = computed(
  () => listing.value?.primary_image || listing.value?.images?.[0]?.url || null,
)

const sellerId = computed(() => listing.value?.seller?.id || listing.value?.user?.id)
const sellerName = computed(() => listing.value?.seller?.name || listing.value?.user?.name || 'Unknown seller')
const isOwnListing = computed(() => sellerId.value === auth.user?.id)

const displayCondition = computed(() => {
  const value = listing.value?.condition
  if (!value) return 'Not specified'
  return String(value).replace(/_/g, ' ')
})

const openImageModal = (url) => {
  if (!url) return
  selectedImage.value = url
  showImageModal.value = true
}

const onRequestSuccess = () => {
  toast.success('Purchase request sent successfully!')
  router.push({ name: 'requests' })
}
</script>
