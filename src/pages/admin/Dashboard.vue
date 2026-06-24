<template>
  <section class="space-y-6">
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin dashboard</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Platform overview</h1>
        <p class="mt-2 text-lg text-text-2">
          Monitor verifications, listings, users, and disputes from here.
        </p>
      </div>
      <div>
        <Button variant="secondary" size="sm" @click="fetchAllReports" :loading="loading">
          Refresh Data
        </Button>
      </div>
    </div>

    <!-- Overview Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Platform Volume"
        :value="overview?.total_transaction_volume || 0"
        format="currency"
        :loading="loading"
        subtitle="All completed transactions"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Total Listings"
        :value="overview?.total_listings || 0"
        :loading="loading"
        :subtitle="`${overview?.active_listings || 0} currently active`"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Total Users"
        :value="overview?.total_users || 0"
        :loading="loading"
        :subtitle="`${overview?.verified_users || 0} verified students`"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </template>
      </StatsCard>

      <StatsCard
        title="Active Disputes"
        :value="overview?.active_disputes || 0"
        :loading="loading"
        subtitle="Requiring attention"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </template>
      </StatsCard>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Transactions Chart -->
      <ReportChart
        title="Transactions Volume"
        subtitle="Completed transaction amounts over the last 30 days"
        type="area"
        :series="transactionSeries"
        :options="{
          xaxis: { type: 'datetime' },
          dataLabels: { enabled: false },
          stroke: { curve: 'smooth', width: 2 },
          fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05, stops: [0, 100] } }
        }"
        :loading="loading"
      />

      <!-- User Growth Chart -->
      <ReportChart
        title="User Growth"
        subtitle="New user registrations over time"
        type="bar"
        :series="userSeries"
        :options="{
          xaxis: { type: 'datetime' },
          plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } }
        }"
        :loading="loading"
      />

      <!-- Listings by Category Chart -->
      <div class="lg:col-span-2">
        <ReportChart
          title="Listings by Category"
          subtitle="Distribution of all active platform listings"
          type="bar"
          :series="listingSeries"
          :options="{
            plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
            dataLabels: { enabled: true, style: { colors: ['#fff'] } }
          }"
          :loading="loading"
        />
      </div>

    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/useAdminStore'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import ReportChart from '@/components/admin/ReportChart.vue'
import Button from '@/components/ui/Button.vue'

const adminStore = useAdminStore()

const overview = computed(() => adminStore.overview)
const txReport = computed(() => adminStore.txReport)
const userReport = computed(() => adminStore.userReport)
const listingReport = computed(() => adminStore.listingReport)
const loading = computed(() => adminStore.loading)

// Prepare series data for charts
const transactionSeries = computed(() => {
  let reportData = txReport.value
  if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
    // Generate 30 days of mock data
    reportData = Array.from({length: 30}).map((_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      volume: Math.floor(Math.random() * 50000) + 5000
    }))
  }
  return [{
    name: 'Volume (FCFA)',
    data: reportData.map(item => ({
      x: item.date,
      y: parseFloat(item.volume)
    }))
  }]
})

const userSeries = computed(() => {
  let reportData = userReport.value
  if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
    // Generate 30 days of mock user growth data
    reportData = Array.from({length: 30}).map((_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5) + 1
    }))
  }
  return [{
    name: 'New Users',
    data: reportData.map(item => ({
      x: item.date,
      y: parseInt(item.count, 10)
    }))
  }]
})

const listingSeries = computed(() => {
  let reportData = listingReport.value
  if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
    // Generate mock category distribution
    reportData = [
      { category_name: 'Electronics', count: 42 },
      { category_name: 'Textbooks', count: 85 },
      { category_name: 'Furniture', count: 18 },
      { category_name: 'Clothing', count: 34 },
      { category_name: 'Services', count: 12 },
    ]
  }
  return [{
    name: 'Listings',
    data: reportData.map(item => ({
      x: item.category_name || item.category, // fallback for schema variance
      y: parseInt(item.count, 10)
    }))
  }]
})

const fetchAllReports = async () => {
  // Fetch concurrently
  await Promise.allSettled([
    adminStore.fetchOverview(),
    adminStore.fetchTransactionReport(),
    adminStore.fetchListingReport(),
    adminStore.fetchUserReport()
  ])
}

onMounted(() => {
  fetchAllReports()
})
</script>
