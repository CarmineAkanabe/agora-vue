<template>
  <div class="public-layout">
    <AuthNavbar v-if="auth.isLoggedIn" />
    <PublicNavbar v-else />

    <main class="public-main">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import AuthNavbar from '@/components/AuthNavbar.vue'
import PublicNavbar from '@/components/PublicNavbar.vue'
import Footer from '@/components/Footer.vue'

const auth = useAuthStore()
</script>

<style scoped>
.public-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.public-main {
  flex: 1;
}
</style>
