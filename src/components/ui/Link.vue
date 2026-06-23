<template>
  <component
    :is="tag"
    :href="tag === 'a' ? href : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :class="['link', `link-${variant}`]"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

// ============================================================
// Link.vue
// Variants: default | muted | underline
// Renders as router-link (to), anchor (href), or span.
// ============================================================

const props = defineProps({
  to:       { type: [String, Object], default: null },
  href:     { type: String, default: null },
  variant:  {
    type: String,
    default: 'default',
    validator: (v) => ['default', 'muted', 'underline'].includes(v),
  },
  external: { type: Boolean, default: false },
})

const tag = computed(() => {
  if (props.to)   return 'router-link'
  if (props.href) return 'a'
  return 'span'
})
</script>

<style scoped>
.link {
  cursor: pointer;
  transition: color var(--transition-fast);
  text-decoration: none;
  font-size: inherit;
}

.link-default {
  color: var(--color-primary);
}

.link-default:hover {
  color: var(--color-primary-dim);
}

.link-muted {
  color: var(--color-text-2);
}

.link-muted:hover {
  color: var(--color-text-1);
}

.link-underline {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.link-underline:hover {
  color: var(--color-primary-dim);
}
</style>
