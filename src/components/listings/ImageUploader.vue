<template>
  <div class="space-y-4">
    <div class="flex items-start justify-between gap-4">
      <div>
        <label class="label">Images</label>
        <p class="mt-1 text-sm text-text-2">
          Upload up to {{ maxFiles }} images. The first image will be used as the primary image.
        </p>
      </div>
      <label class="btn btn-secondary btn-sm cursor-pointer">
        <input type="file" class="sr-only" accept="image/*" multiple @change="handleFiles" />
        Add images
      </label>
    </div>

    <div
      v-if="errors.length"
      class="rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
    >
      <ul class="list-disc space-y-1 pl-5">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <div v-if="files.length" class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="(file, index) in files"
        :key="`${file.name}-${index}`"
        class="rounded-2xl border border-border bg-surface-3/70 p-3"
      >
        <img :src="previews[index]" alt="Preview" class="h-36 w-full rounded-xl object-cover" />
        <div class="mt-3 flex items-center justify-between gap-2">
          <p class="truncate text-sm text-text-1">{{ file.name }}</p>
          <button type="button" class="text-sm text-primary" @click="$emit('set-primary', index)">
            {{ primaryIndex === index ? 'Primary' : 'Make primary' }}
          </button>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-text-3">
          <span>{{ formatFileSize(file.size) }}</span>
          <button type="button" class="text-danger" @click="$emit('remove-file', index)">
            Remove
          </button>
        </div>
      </div>
    </div>

    <div
      v-else
      class="rounded-2xl border border-dashed border-border bg-surface-3/40 p-6 text-center text-sm text-text-2"
    >
      No images selected yet.
    </div>
  </div>
</template>

<script setup>
import { formatFileSize } from '@/utils/formatters'

defineProps({
  files: { type: Array, default: () => [] },
  previews: { type: Array, default: () => [] },
  primaryIndex: { type: Number, default: 0 },
  errors: { type: Array, default: () => [] },
  maxFiles: { type: Number, default: 5 },
  maxMB: { type: Number, default: 2 },
})

const emit = defineEmits(['add-files', 'remove-file', 'set-primary'])

const handleFiles = (event) => {
  const selected = Array.from(event.target.files || [])
  if (selected.length) emit('add-files', selected)
  event.target.value = ''
}
</script>
