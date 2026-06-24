<template>
  <section class="space-y-6">
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Users</h1>
        <p class="mt-2 text-lg text-text-2">
          Manage all registered user accounts.
        </p>
      </div>
    </div>

    <div>
      <template v-if="loading">
        <div class="space-y-4">
          <div v-for="i in 5" :key="i" class="card p-5 flex gap-4">
            <div class="skeleton h-12 w-12 rounded-full shrink-0" />
            <div class="flex-1 space-y-2 py-1">
              <div class="skeleton h-5 w-1/4 rounded" />
              <div class="skeleton h-4 w-1/3 rounded" />
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="users.length === 0">
        <div class="card p-12 flex flex-col items-center text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-text-3 mb-4">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <h2 class="text-xl font-semibold text-text-1">No users found</h2>
          <p class="text-text-2 mt-2">There are no registered users on the platform.</p>
        </div>
      </template>

      <template v-else>
        <div class="space-y-4">
          <UserCard 
            v-for="user in users" 
            :key="user.id" 
            :user="user" 
          />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/useAdminStore'
import UserCard from '@/components/admin/UserCard.vue'

const adminStore = useAdminStore()

const users = computed(() => adminStore.users)
const loading = computed(() => adminStore.loading)

onMounted(() => {
  adminStore.fetchUsers()
})
</script>
