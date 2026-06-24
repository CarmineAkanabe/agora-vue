<template>
  <section class="space-y-6">
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Disputes</h1>
        <p class="mt-2 text-lg text-text-2">
          Manage and resolve conflicts between buyers and sellers.
        </p>
      </div>
      <div>
        <Badge v-if="openDisputesCount > 0" variant="warning" class="text-sm px-3 py-1">
          {{ openDisputesCount }} open disputes
        </Badge>
      </div>
    </div>

    <div>
      <template v-if="loading">
        <div class="space-y-4">
          <div v-for="i in 3" :key="i" class="card p-5 flex gap-4">
            <div class="skeleton h-10 w-10 rounded-full shrink-0" />
            <div class="flex-1 space-y-2 py-1">
              <div class="skeleton h-5 w-1/4 rounded" />
              <div class="skeleton h-4 w-1/3 rounded" />
            </div>
            <div class="skeleton h-8 w-24 rounded" />
          </div>
        </div>
      </template>

      <template v-else-if="disputes.length === 0">
        <div class="card p-12 flex flex-col items-center text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-success mb-4">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h2 class="text-xl font-semibold text-text-1">No disputes</h2>
          <p class="text-text-2 mt-2">There are no open disputes requiring your attention.</p>
        </div>
      </template>

      <template v-else>
        <div class="space-y-4">
          <DisputeCard 
            v-for="dispute in disputes" 
            :key="dispute.id" 
            :dispute="dispute" 
          />
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/useAdminStore'
import DisputeCard from '@/components/admin/DisputeCard.vue'
import Badge from '@/components/ui/Badge.vue'

const adminStore = useAdminStore()

const disputes = computed(() => adminStore.disputes)
const loading = computed(() => adminStore.loading)

const openDisputesCount = computed(() => {
  return disputes.value.filter(d => d.status === 'open').length
})

onMounted(() => {
  adminStore.fetchDisputes()
})
</script>
