<template>
  <section class="space-y-6">
    <!-- Header -->
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Manage User</h1>
        <p class="mt-2 text-lg text-text-2">
          View user details and manage account access.
        </p>
      </div>
      <div>
        <router-link :to="{ name: 'admin-users' }" class="btn btn-ghost btn-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to users
        </router-link>
      </div>
    </div>

    <!-- Loading -->
    <template v-if="loading && !user">
      <div class="card p-8">
        <div class="skeleton h-8 w-1/3 rounded mb-8" />
        <div class="grid md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="skeleton h-20 w-20 rounded-full" />
              <div class="space-y-2 flex-1">
                <div class="skeleton h-6 w-1/2 rounded" />
                <div class="skeleton h-4 w-1/3 rounded" />
              </div>
            </div>
            <div class="space-y-4">
              <div class="skeleton h-6 w-full rounded" />
              <div class="skeleton h-6 w-3/4 rounded" />
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Content -->
    <template v-else-if="user">
      <div class="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
        
        <!-- Left: Profile Details -->
        <div class="card p-6 flex flex-col">
          <div class="flex items-start justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-full flex items-center justify-center shrink-0 text-xl font-bold"
                   :class="user.is_banned ? 'bg-danger-ghost text-danger' : 'bg-surface-3 text-text-1'">
                {{ getInitials(user.name) }}
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-text-1">{{ user.name }}</h2>
                <p class="text-text-2">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex flex-col items-end gap-2">
              <Badge v-if="user.role === 'admin'" variant="danger">Admin</Badge>
              <Badge v-if="user.is_banned" variant="danger">Banned</Badge>
              <Badge v-else-if="user.verification_status === 'verified'" variant="success">Verified</Badge>
              <Badge v-else-if="user.verification_status === 'pending'" variant="warning">Pending Verification</Badge>
              <Badge v-else variant="info">Unverified</Badge>
            </div>
          </div>
          
          <div class="space-y-4 flex-1 mt-4">
            <div class="pb-4 border-b border-border grid grid-cols-2">
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">User ID</p>
                <p class="font-medium text-text-1">{{ user.id }}</p>
              </div>
              <div>
                <p class="text-xs uppercase tracking-wider text-text-3 mb-1">Joined On</p>
                <p class="font-medium text-text-1">{{ formatDate(user.created_at) }}</p>
              </div>
            </div>
            <div class="pb-4 border-b border-border">
              <p class="text-xs uppercase tracking-wider text-text-3 mb-1">University Details</p>
              <p v-if="user.verification_status === 'verified'" class="font-medium text-text-1">
                Verified student (ID matched)
              </p>
              <p v-else class="text-text-3 italic">Not yet verified</p>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="card p-6">
          <h2 class="text-xl font-semibold text-text-1 mb-4">Account Actions</h2>
          
          <div class="space-y-4">
            <div v-if="user.role === 'admin'" class="p-4 bg-surface-3 rounded-lg border border-border">
              <p class="text-sm text-text-2">This user is an administrator. Banning is disabled.</p>
            </div>
            
            <template v-else>
              <div v-if="user.is_banned" class="p-4 bg-danger-ghost/30 rounded-lg border border-danger/30 mb-4">
                <h3 class="text-danger font-medium mb-1">Account is Banned</h3>
                <p class="text-sm text-text-2">This user cannot log in or use the platform.</p>
              </div>
              
              <Button v-if="user.is_banned" variant="secondary" class="w-full" @click="showUnbanModal = true">
                Unban User
              </Button>
              <Button v-else variant="danger" class="w-full" @click="showBanModal = true">
                Ban User
              </Button>
              
              <div class="pt-6 mt-6 border-t border-border">
                <Button variant="danger" class="w-full" @click="showDeleteModal = true">
                  Delete Account
                </Button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="card p-12 text-center text-text-2">
        User not found.
      </div>
    </template>

    <!-- Ban Modal -->
    <Modal
      v-model="showBanModal"
      title="Ban User"
      variant="danger"
      show-actions
      confirm-label="Ban User"
      :loading="isBanning"
      @confirm="handleBan"
    >
      <p class="text-text-2">
        Are you sure you want to ban <strong>{{ user?.name }}</strong>? They will immediately lose access to their account and the platform.
      </p>
    </Modal>

    <!-- Unban Modal -->
    <Modal
      v-model="showUnbanModal"
      title="Unban User"
      variant="success"
      show-actions
      confirm-label="Unban User"
      :loading="isUnbanning"
      @confirm="handleUnban"
    >
      <p class="text-text-2">
        Are you sure you want to unban <strong>{{ user?.name }}</strong>? They will regain access to their account.
      </p>
    </Modal>

    <!-- Delete Modal -->
    <Modal
      v-model="showDeleteModal"
      title="Delete Account"
      variant="danger"
      show-actions
      confirm-label="Delete Permanently"
      :loading="isDeleting"
      @confirm="handleDelete"
    >
      <p class="text-text-2">
        Are you sure you want to permanently delete <strong>{{ user?.name }}</strong>? This action cannot be undone and all their data will be removed.
      </p>
    </Modal>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/useAdminStore'
import { formatDate, getInitials } from '@/utils/formatters'
import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'

const props = defineProps({ id: { type: [String, Number], required: true } })
const route = useRoute()
const adminStore = useAdminStore()

const userId = computed(() => props.id || route.params.id)
const user = computed(() => adminStore.user)
const loading = computed(() => adminStore.loading)

const showBanModal = ref(false)
const isBanning = ref(false)

const showUnbanModal = ref(false)
const isUnbanning = ref(false)

const showDeleteModal = ref(false)
const isDeleting = ref(false)

onMounted(() => {
  adminStore.fetchUser(userId.value)
})

const handleBan = async () => {
  isBanning.value = true
  try {
    await adminStore.banUser(userId.value)
    showBanModal.value = false
  } catch (error) {
    console.error('Failed to ban user', error)
  } finally {
    isBanning.value = false
  }
}

const handleUnban = async () => {
  isUnbanning.value = true
  try {
    await adminStore.unbanUser(userId.value)
    showUnbanModal.value = false
  } catch (error) {
    console.error('Failed to unban user', error)
  } finally {
    isUnbanning.value = false
  }
}

const handleDelete = async () => {
  isDeleting.value = true
  try {
    await adminStore.deleteUser(userId.value) // This needs to be added to adminStore, or just use api.delete
    showDeleteModal.value = false
    // Navigate back to users list
    import('vue-router').then(({ useRouter }) => useRouter().push({ name: 'admin-users' }))
  } catch (error) {
    console.error('Failed to delete user', error)
  } finally {
    isDeleting.value = false
  }
}
</script>
