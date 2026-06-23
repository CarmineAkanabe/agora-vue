<template>
  <div class="public-layout">
    <PublicNavbar />

    <main class="public-main">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import PublicNavbar from '@/components/PublicNavbar.vue'
import Footer from '@/components/Footer.vue'
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
