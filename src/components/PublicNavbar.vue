<template>
  <header class="public-navbar">
    <div class="container navbar-inner">
      <!-- Logo -->
      <router-link :to="{ name: 'home' }" class="navbar-logo">
        <span class="logo-text">Agora</span>
      </router-link>

      <!-- Desktop nav links -->
      <nav class="navbar-links">
        <router-link :to="{ name: 'browse' }" class="nav-link">Browse</router-link>
        <router-link :to="{ name: 'about' }" class="nav-link">About</router-link>
      </nav>

      <!-- Actions -->
      <div class="navbar-actions">
        <Button v-if="!auth.isLoggedIn" variant="ghost" size="sm" :to="{ name: 'login' }">
          Login
        </Button>

        <Button v-if="!auth.isLoggedIn" variant="primary" size="sm" :to="{ name: 'register' }">
          Get Started
        </Button>

        <Button
          v-else
          variant="primary"
          size="sm"
          :to="auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'dashboard' }"
        >
          Go to Dashboard
        </Button>
      </div>

      <!-- Mobile menu toggle -->
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
        <router-link :to="{ name: 'browse' }" class="mobile-nav-link" @click="mobileOpen = false"
          >Browse</router-link
        >
        <router-link :to="{ name: 'about' }" class="mobile-nav-link" @click="mobileOpen = false"
          >About</router-link
        >
        <div class="mobile-nav-divider" />
        <router-link
          v-if="!auth.isLoggedIn"
          :to="{ name: 'login' }"
          class="mobile-nav-link"
          @click="mobileOpen = false"
          >Login</router-link
        >
        <router-link
          v-if="!auth.isLoggedIn"
          :to="{ name: 'register' }"
          class="mobile-nav-link"
          @click="mobileOpen = false"
          >Get Started</router-link
        >
        <router-link
          v-else
          :to="auth.isAdmin ? { name: 'admin-dashboard' } : { name: 'dashboard' }"
          class="mobile-nav-link"
          @click="mobileOpen = false"
        >
          Dashboard
        </router-link>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import Button from '@/components/ui/Button.vue'

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
.public-navbar {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  background-color: rgba(15, 15, 19, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.navbar-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
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
  gap: var(--spacing-6);
}

.nav-link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-2);
  text-decoration: none;
  transition: color var(--transition-fast);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-text-1);
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

/* Mobile */
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

.mobile-nav-link:hover {
  color: var(--color-text-1);
  background-color: var(--color-surface-3);
  padding-left: var(--spacing-4);
}

.mobile-nav-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: var(--spacing-2) 0;
}

/* Transition */
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
  max-height: 400px;
}

@media (max-width: 768px) {
  .navbar-links,
  .navbar-actions {
    display: none;
  }

  .navbar-mobile-toggle {
    display: flex;
  }
}
</style>
