<template>
  <header class="auth-navbar">
    <div class="container navbar-inner">
      <!-- Logo -->
      <router-link
        :to="auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'dashboard' }"
        class="navbar-logo"
      >
        <img src="/agora-logo.svg" alt="Agora" class="logo-img" />
      </router-link>

      <!-- Desktop nav — student only -->
      <nav v-if="!auth.isAdmin" class="navbar-links">
        <router-link :to="{ name: 'browse' }" class="nav-link">Browse</router-link>
        <router-link :to="{ name: 'my-listings' }" class="nav-link">My Listings</router-link>
        <router-link :to="{ name: 'my-reviews' }" class="nav-link">My Reviews</router-link>
        <router-link :to="{ name: 'requests' }" class="nav-link">Requests</router-link>
        <router-link :to="{ name: 'transactions' }" class="nav-link">Transactions</router-link>
      </nav>

      <!-- Desktop nav — admin only -->
      <nav v-else class="navbar-links">
        <router-link :to="{ name: 'admin-verifications' }" class="nav-link"
          >Verifications</router-link
        >
        <router-link :to="{ name: 'admin-users' }" class="nav-link">Users</router-link>
        <router-link :to="{ name: 'admin-listings' }" class="nav-link">Listings</router-link>
        <router-link :to="{ name: 'admin-disputes' }" class="nav-link">Disputes</router-link>
        <router-link :to="{ name: 'admin-categories' }" class="nav-link">Categories</router-link>
      </nav>

      <!-- Right side actions -->
      <div class="navbar-actions">
        <!-- Create listing button — student only -->
        <Button
          v-if="auth.isVerified && !auth.isAdmin"
          variant="accent"
          size="sm"
          :to="{ name: 'create-listing' }"
        >
          + List Item
        </Button>

        <!-- Notifications — all auth users -->
        <NotificationDropdown />

        <!-- Profile menu -->
        <ProfileMenu />
      </div>

      <!-- Mobile toggle -->
      <button class="navbar-mobile-toggle" @click="mobileOpen = !mobileOpen">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line v-if="!mobileOpen" x1="3" y1="6" x2="21" y2="6" />
          <line v-if="!mobileOpen" x1="3" y1="12" x2="21" y2="12" />
          <line v-if="!mobileOpen" x1="3" y1="18" x2="21" y2="18" />
          <line v-if="mobileOpen" x1="18" y1="6" x2="6" y2="18" />
          <line v-if="mobileOpen" x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileOpen" class="navbar-mobile-menu">
        <template v-if="!auth.isAdmin">
          <router-link :to="{ name: 'browse' }" class="mobile-nav-link" @click="mobileOpen = false"
            >Browse</router-link
          >
          <router-link
            :to="{ name: 'my-listings' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >My Listings</router-link
          >
          <router-link
            :to="{ name: 'my-reviews' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >My Reviews</router-link
          >
          <router-link
            :to="{ name: 'requests' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Requests</router-link
          >
          <router-link
            :to="{ name: 'transactions' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Transactions</router-link
          >
          <router-link
            :to="{ name: 'create-listing' }"
            class="mobile-nav-link mobile-nav-accent"
            @click="mobileOpen = false"
            >+ List Item</router-link
          >
        </template>

        <template v-else>
          <router-link
            :to="{ name: 'admin-verifications' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Verifications</router-link
          >
          <router-link
            :to="{ name: 'admin-users' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Users</router-link
          >
          <router-link
            :to="{ name: 'admin-listings' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Listings</router-link
          >
          <router-link
            :to="{ name: 'admin-disputes' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Disputes</router-link
          >
          <router-link
            :to="{ name: 'admin-reports' }"
            class="mobile-nav-link"
            @click="mobileOpen = false"
            >Reports</router-link
          >
        </template>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Button from '@/components/ui/Button.vue'
import NotificationDropdown from '@/components/NotificationDropdown.vue'
import ProfileMenu from '@/components/ProfileMenu.vue'

const auth = useAuthStore()
const route = useRoute()
const mobileOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    mobileOpen.value = false
  },
)
</script>

<style scoped>
.auth-navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: rgba(15, 15, 19, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: var(--spacing-6);
}

.navbar-logo {
  text-decoration: none;
  flex-shrink: 0;
}

.logo-img {
  width: 136px;
  height: 40px;
  object-fit: contain;
}

.logo-text {
  font-family: var(--font-display);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-1);
  letter-spacing: -0.02em;
}

.logo-text::after {
  content: '.';
  color: var(--color-primary);
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  flex: 1;
}

.nav-link {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
  text-decoration: none;
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-text-1);
  background-color: var(--color-surface-3);
}

.nav-link.router-link-active {
  color: var(--color-primary);
  background-color: var(--color-primary-ghost);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-shrink: 0;
}

.navbar-mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-1);
  padding: var(--spacing-1);
}

.navbar-mobile-menu {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-surface-2);
  gap: var(--spacing-1);
}

.mobile-nav-link {
  display: block;
  padding: var(--spacing-3) var(--spacing-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
  text-decoration: none;
  border-radius: var(--radius-base);
  transition: all var(--transition-fast);
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  color: var(--color-text-1);
  background-color: var(--color-surface-3);
  padding-left: var(--spacing-4);
}

.mobile-nav-accent {
  color: var(--color-accent);
}

/* Mobile menu transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all var(--transition-base);
  overflow: hidden;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  max-height: 0;
}

.mobile-menu-enter-to,
.mobile-menu-leave-from {
  opacity: 1;
  max-height: 500px;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }
  .navbar-actions .btn {
    display: none;
  }
  .navbar-mobile-toggle {
    display: flex;
  }
}
</style>

