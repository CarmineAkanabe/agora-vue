<script setup>
// import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

onMounted(async () => {
  await auth.refreshUser()
})

</script>

<template>
  <div>

  </div>
</template>

<style scoped>

</style>

