<template>
  <div class="profile-menu-wrapper" ref="wrapperRef">

    <!-- Trigger -->
    <button class="profile-trigger" @click="toggleOpen">
      <Avatar
        :src="auth.user?.profile?.profile_picture"
        :name="auth.user?.name"
        size="sm"
      />
      <span class="profile-name">{{ firstName }}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <!-- Dropdown -->
    <Transition name="dropdown">
      <div v-if="open" class="profile-dropdown">

        <!-- User info -->
        <div class="profile-info">
          <Avatar
            :src="auth.user?.profile?.profile_picture"
            :name="auth.user?.name"
            size="md"
          />
          <div class="profile-info-text">
            <span class="profile-info-name">{{ auth.user?.name }}</span>
            <span class="profile-info-email">{{ auth.user?.email }}</span>
          </div>
        </div>

        <div class="divider" />

        <!-- Menu items -->
        <nav class="profile-nav">

          <template v-if="auth.isAdmin">
            <router-link :to="{ name: 'admin-dashboard' }"     class="profile-nav-item" @click="open = false">Dashboard</router-link>
            <router-link :to="{ name: 'admin-verifications' }" class="profile-nav-item" @click="open = false">Verifications</router-link>
            <router-link :to="{ name: 'admin-disputes' }"      class="profile-nav-item" @click="open = false">Disputes</router-link>
          </template>

          <template v-else>
            <router-link :to="{ name: 'dashboard' }"       class="profile-nav-item" @click="open = false">Dashboard</router-link>
            <router-link :to="{ name: 'my-listings' }"     class="profile-nav-item" @click="open = false">My Listings</router-link>
            <router-link :to="{ name: 'requests' }"        class="profile-nav-item" @click="open = false">My Requests</router-link>
            <router-link :to="{ name: 'transactions' }"    class="profile-nav-item" @click="open = false">Transactions</router-link>
            <router-link :to="{ name: 'profile' }"         class="profile-nav-item" @click="open = false">My Profile</router-link>
          </template>

        </nav>

        <div class="divider" />

        <!-- Logout -->
        <button class="profile-logout" @click="handleLogout" :disabled="auth.loading">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {{ auth.loading ? 'Logging out...' : 'Log out' }}
        </button>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import Avatar from '@/components/ui/Avatar.vue'

const auth       = useAuthStore()
const open       = ref(false)
const wrapperRef = ref(null)

const firstName = computed(() => auth.user?.name?.split(' ')[0] ?? '')

const toggleOpen = () => { open.value = !open.value }

const handleLogout = async () => {
  open.value = false
  await auth.logout()
}

const handleOutsideClick = (e) => {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    open.value = false
  }
}

const handleKeydown = (e) => {
  if (e.key === 'Escape' && open.value) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleOutsideClick)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.profile-menu-wrapper {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--spacing-1) var(--spacing-3) var(--spacing-1) var(--spacing-1);
  cursor: pointer;
  color: var(--color-text-2);
  transition: all var(--transition-fast);
}

.profile-trigger:hover {
  border-color: var(--color-primary);
  color: var(--color-text-1);
}

.profile-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-1);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 240px;
  background-color: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  overflow: hidden;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4) var(--spacing-4);
}

.profile-info-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.profile-info-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-info-email {
  font-size: var(--font-size-xs);
  color: var(--color-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-nav {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-2) 0;
}

.profile-nav-item {
  display: block;
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--color-text-2);
  text-decoration: none;
  transition: all var(--transition-fast);
}

.profile-nav-item:hover,
.profile-nav-item.router-link-active {
  color: var(--color-text-1);
  background-color: var(--color-surface-3);
}

.profile-logout {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background: none;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-danger);
  transition: background-color var(--transition-fast);
  text-align: left;
}

.profile-logout:hover {
  background-color: var(--color-danger-ghost);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--transition-base);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
