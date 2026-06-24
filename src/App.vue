<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

onMounted(async () => {
  await auth.initialize()
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
