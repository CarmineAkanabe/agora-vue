<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div class="grid gap-6 lg:grid-cols-2">
      <UiInput v-model="form.title" label="Title" placeholder="e.g. Physics textbook" required />
      <UiSelect v-model="form.condition" label="Condition" :options="listingConditions" required />

      <UiSelect v-model="form.category_id" label="Category" :options="categoryOptions" required />
      <UiInput v-model="form.price" label="Price (XAF)" type="number" min="1" required />

      <UiInput v-model="form.quantity" label="Quantity" type="number" min="1" required />
      <div class="flex items-end">
        <UiInput v-model="form.primary_image" label="Primary image index" type="number" min="0" />
      </div>
    </div>

    <UiTextarea
      v-model="form.description"
      label="Description"
      placeholder="Describe the item"
      required
    />

    <ImageUploader
      :files="uploadFiles"
      :previews="uploadPreviews"
      :primary-index="primaryIndex"
      :errors="uploadErrors"
      :max-files="5"
      @add-files="handleAddFiles"
      @remove-file="handleRemoveFile"
      @set-primary="handleSetPrimary"
    />

    <div class="flex flex-wrap gap-3">
      <Button type="submit" :loading="submitting" :disabled="submitting">
        {{ isEdit ? 'Save changes' : 'Create listing' }}
      </Button>
      <Button variant="ghost" type="button" @click="emit('cancel')">Cancel</Button>
    </div>

    <div
      v-if="serverError"
      class="rounded-xl border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
    >
      {{ serverError }}
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { useListingStore } from '@/stores/useListingStore'
import { LISTING_CONDITIONS } from '@/utils/constants'
import { useImageUpload } from '@/composables/useImageUpload'
import UiInput from '@/components/ui/Input.vue'
import UiSelect from '@/components/ui/Select.vue'
import UiTextarea from '@/components/ui/Textarea.vue'
import ImageUploader from '@/components/listings/ImageUploader.vue'
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEdit: { type: Boolean, default: false },
})

const emit = defineEmits(['submitted', 'cancel'])
const categoryStore = useCategoryStore()
const listingStore = useListingStore()

const form = reactive({
  category_id: '',
  title: '',
  description: '',
  price: '',
  quantity: '1',
  condition: '',
  primary_image: '0',
})

const {
  files: uploadFiles,
  previews: uploadPreviews,
  primaryIndex,
  addFiles,
  removeFile,
  setPrimary,
  errors: uploadErrors,
  reset,
} = useImageUpload()
const serverError = ref('')
const submitting = ref(false)

const categoryOptions = computed(() =>
  categoryStore.categories.map((category) => ({ value: category.id, label: category.name })),
)

const listingConditions = LISTING_CONDITIONS.map((option) => ({
  value: option.value,
  label: option.label,
}))

watch(
  () => props.initialData,
  (value) => {
    if (!value) return
    form.category_id = value.category_id ?? value.category?.id ?? ''
    form.title = value.title ?? ''
    form.description = value.description ?? ''
    form.price = value.price ?? ''
    form.quantity = value.quantity ?? '1'
    form.condition = value.condition ?? ''
    form.primary_image = value.primary_image ? String(value.primary_image) : '0'
  },
  { immediate: true },
)

onMounted(() => {
  categoryStore.fetchCategories()
})

const handleAddFiles = (selected) => {
  addFiles(selected)
}

const handleRemoveFile = (index) => {
  removeFile(index)
}

const handleSetPrimary = (index) => {
  setPrimary(index)
}

const buildPayload = () => ({
  category_id: Number(form.category_id),
  title: form.title,
  description: form.description,
  price: Number(form.price),
  quantity: Number(form.quantity),
  condition: form.condition,
  primary_image: Number(form.primary_image || 0),
  images: uploadFiles.value,
})

const handleSubmit = async () => {
  serverError.value = ''
  submitting.value = true

  try {
    const payload = buildPayload()
    const result = props.isEdit
      ? await listingStore.updateListing(props.initialData.id, payload)
      : await listingStore.storeListing(payload)

    reset()
    emit('submitted', result)
  } catch (error) {
    serverError.value =
      error.response?.data?.message || 'Unable to save your listing. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
