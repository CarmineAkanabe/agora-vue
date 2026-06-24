<template>
  <aside class="card space-y-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-xl font-semibold text-text-1">Search & refine</h2>
      <button class="text-sm text-primary" @click="emit('reset-filters')">Reset</button>
    </div>

    <div class="space-y-3">
      <label class="block text-sm font-medium text-text-2">Search</label>
      <input
        :value="searchQuery"
        class="input"
        placeholder="Search listings"
        @input="emit('update:search-query', $event.target.value)"
      />

      <label class="block text-sm font-medium text-text-2">Category</label>
      <select
        :value="filters['filter[category_id]'] ?? ''"
        class="input"
        @change="
          emit('update:filters', {
            ...filters,
            'filter[category_id]': normalizeValue($event.target.value),
          })
        "
      >
        <option :value="''">All categories</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>

      <label class="block text-sm font-medium text-text-2">Condition</label>
      <select
        :value="filters['filter[condition]'] ?? ''"
        class="input"
        @change="
          emit('update:filters', {
            ...filters,
            'filter[condition]': normalizeValue($event.target.value),
          })
        "
      >
        <option :value="''">Any condition</option>
        <option value="new">New</option>
        <option value="like_new">Like New</option>
        <option value="good">Good</option>
        <option value="fair">Fair</option>
      </select>

      <label class="block text-sm font-medium text-text-2">Max price</label>
      <input
        :value="filters['filter[price_between]'] ?? ''"
        class="input"
        type="number"
        min="0"
        placeholder="Max price"
        @change="
          emit('update:filters', {
            ...filters,
            'filter[price_between]': normalizeValue($event.target.value),
          })
        "
      />

      <label class="block text-sm font-medium text-text-2">Sort</label>
      <select
        :value="filters.sort"
        class="input"
        @change="emit('update:filters', { ...filters, sort: $event.target.value })"
      >
        <option value="-created_at">Newest first</option>
        <option value="created_at">Oldest first</option>
        <option value="price">Price: low to high</option>
        <option value="-price">Price: high to low</option>
      </select>
    </div>

    <div
      v-if="loading"
      class="rounded-xl border border-border bg-surface-3/60 p-3 text-sm text-text-3"
    >
      Updating results...
    </div>
  </aside>
</template>

<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
  filters: { type: Object, default: () => ({}) },
  searchQuery: { type: String, default: '' },
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:search-query', 'update:filters', 'reset-filters'])

const normalizeValue = (value) => {
  if (value === '' || value === null || value === undefined) return null
  return value
}
</script>
