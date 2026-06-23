<template>
  <div :class="['avatar', `avatar-${size}`]">

    <img
      v-if="src && !imgError"
      :src="src"
      :alt="alt"
      class="avatar-img"
      @error="imgError = true"
    />

    <span v-else class="avatar-initials">
      {{ initials }}
    </span>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { getInitials } from '@/utils/formatters'

// ============================================================
// Avatar.vue
// Sizes: sm | md | lg
// Shows profile picture if available, initials fallback.
// ============================================================

const props = defineProps({
  src:  { type: String, default: null },
  name: { type: String, default: '' },
  alt:  { type: String, default: 'Avatar' },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
})

const imgError = ref(false)
const initials = computed(() => getInitials(props.name))
</script>

<style scoped>
.avatar {
  border-radius: var(--radius-full);
  background-color: var(--color-primary-ghost);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-sm { width: 32px;  height: 32px; }
.avatar-md { width: 40px;  height: 40px; }
.avatar-lg { width: 64px;  height: 64px; }

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-transform: uppercase;
  user-select: none;
}

.avatar-sm .avatar-initials { font-size: var(--font-size-xs); }
.avatar-md .avatar-initials { font-size: var(--font-size-sm); }
.avatar-lg .avatar-initials { font-size: var(--font-size-lg); }
</style>
