<template>
  <section class="container section space-y-8">
    <!-- Header -->
    <div class="glass-card p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Student dashboard</p>
        <h1 class="mt-3 text-3xl font-bold text-text-1">
          Welcome back, {{ auth.user?.name || 'student' }}
        </h1>
        <p class="mt-3 max-w-2xl text-lg text-text-2">
          Manage your listings, requests, and transactions from one place.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <router-link :to="{ name: 'create-listing' }" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create listing
        </router-link>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <router-link :to="{ name: 'my-listings' }" class="quick-link-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="7" height="7"></rect>
          <rect x="14" y="3" width="7" height="7"></rect>
          <rect x="14" y="14" width="7" height="7"></rect>
          <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
        <span>My Listings</span>
      </router-link>
      <router-link :to="{ name: 'requests' }" class="quick-link-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
        <span>Requests</span>
      </router-link>
      <router-link :to="{ name: 'transactions' }" class="quick-link-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="5" width="20" height="14" rx="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
        <span>Transactions</span>
      </router-link>
      <router-link :to="{ name: 'notifications' }" class="quick-link-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        <span>Inbox</span>
      </router-link>
      <router-link :to="{ name: 'profile' }" class="quick-link-card">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </router-link>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Earned"
        :value="stats?.total_earned || 0"
        format="currency"
        :loading="loading"
        subtitle="from completed sales"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Total Spent"
        :value="stats?.total_spent || 0"
        format="currency"
        :loading="loading"
        subtitle="on completed purchases"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Active Listings"
        :value="stats?.active_listings || 0"
        :loading="loading"
        :subtitle="`of ${stats?.total_listings || 0} total listings`"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Average Rating"
        :value="stats?.average_rating ? stats.average_rating.toFixed(1) : 'N/A'"
        :loading="loading"
        :subtitle="`${stats?.total_reviews || 0} total reviews`"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        </template>
      </StatsCard>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 mb-6">
      <ReportChart
        title="Income Over Time"
        subtitle="Earnings from completed sales over the last 30 days"
        type="area"
        :series="financialSeries"
        :options="{
          xaxis: { type: 'datetime' },
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth', width: 2 },
          colors: ['#10b981'],
          fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } }
        }"
        :loading="loading"
      />
    </div>

    <!-- Bottom Section: Transactions & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      <TransactionSummary
        :transactions="stats?.recent_transactions || []"
        :loading="loading"
      />
      <RecentActivity
        :activities="stats?.recent_activities || []"
        :loading="loading"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDashboardStore } from '@/stores/useDashboardStore'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import TransactionSummary from '@/components/dashboard/TransactionSummary.vue'
import ReportChart from '@/components/admin/ReportChart.vue'

const auth = useAuthStore()
const dashboardStore = useDashboardStore()

const loading = computed(() => dashboardStore.loading)
const stats = computed(() => dashboardStore.stats)

// Generate mock financial data for the student chart
const financialSeries = computed(() => {
  return [{
    name: 'Earnings (FCFA)',
    data: Array.from({length: 30}).map((_, i) => ({
      x: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      y: Math.floor(Math.random() * 20000) + 2000
    }))
  }]
})

onMounted(() => {
  dashboardStore.fetchStats()
})
</script>

<style scoped>
.quick-link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-3);
  padding: var(--spacing-5);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface-3);
  color: var(--color-text-2);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  transition: all var(--transition-fast);
}

.quick-link-card svg {
  color: var(--color-primary);
  opacity: 0.8;
  transition: all var(--transition-fast);
}

.quick-link-card:hover {
  background-color: var(--color-surface-3-hover);
  border-color: var(--color-primary-ghost);
  color: var(--color-text-1);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.quick-link-card:hover svg {
  opacity: 1;
  transform: scale(1.1);
}
</style>
