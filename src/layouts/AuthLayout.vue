<template>
  <div class="auth-layout">
    <AuthNavbar v-if="route.name !== 'pending-verification'" />

    <main class="auth-main">
      <div class="container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AuthNavbar from '@/components/AuthNavbar.vue'

const route = useRoute()
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.auth-main {
  flex: 1;
  padding-block: var(--spacing-8);
}
</style>
