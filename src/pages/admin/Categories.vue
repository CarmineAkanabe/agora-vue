<template>
  <section class="space-y-6">
    <div class="glass-card p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.3em] text-accent">Admin</p>
        <h1 class="mt-2 text-3xl font-bold text-text-1">Categories Management</h1>
        <p class="mt-2 text-lg text-text-2">
          Add, edit, or remove marketplace categories.
        </p>
      </div>
      <div>
        <Button variant="primary" size="sm" @click="openCreateModal">
          + Add Category
        </Button>
      </div>
    </div>

    <div v-if="loading" class="card p-6 space-y-4">
      <div class="skeleton h-12 w-full rounded" />
      <div class="skeleton h-12 w-full rounded" />
      <div class="skeleton h-12 w-full rounded" />
    </div>

    <div v-else-if="categoryStore.categories.length" class="space-y-4">
      <div v-for="category in categoryStore.categories" :key="category.id" class="card p-5 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-text-1">{{ category.name }}</h3>
          <p class="text-sm text-text-3">Slug: {{ category.slug }}</p>
        </div>
        <div class="flex gap-2">
          <Button variant="secondary" size="sm" @click="openEditModal(category)">Edit</Button>
          <Button variant="danger" size="sm" @click="openDeleteModal(category)">Delete</Button>
        </div>
      </div>
    </div>

    <div v-else class="card p-6 text-center text-text-2">
      No categories found. Create one to get started.
    </div>

    <!-- Category Form Modal -->
    <Modal
      v-model="showFormModal"
      :title="isEdit ? 'Edit Category' : 'New Category'"
      variant="form"
      show-actions
      :loading="submitting"
      @confirm="submitForm"
    >
      <div class="space-y-4">
        <UiInput
          id="name"
          v-model="form.name"
          label="Category Name"
          placeholder="e.g. Electronics"
          :error="errors.name?.[0]"
          required
        />
        <UiInput
          id="slug"
          v-model="form.slug"
          label="URL Slug (Optional)"
          placeholder="e.g. electronics"
          :error="errors.slug?.[0]"
        />
        <div v-if="errors.message" class="text-sm text-danger mt-2">{{ errors.message }}</div>
      </div>
    </Modal>

    <!-- Delete Confirm Modal -->
    <Modal
      v-model="showDeleteModal"
      title="Delete Category"
      variant="danger"
      show-actions
      confirm-label="Delete"
      :loading="submitting"
      @confirm="confirmDelete"
    >
      <p>Are you sure you want to delete <strong>{{ selectedCategory?.name }}</strong>? This may affect listings currently using this category.</p>
    </Modal>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '@/plugins/axios'
import { API } from '@/utils/constants'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import UiInput from '@/components/ui/Input.vue'
import { useCategoryStore } from '@/stores/useCategoryStore'
import { toast } from 'vue-sonner'

const categoryStore = useCategoryStore()
const loading = ref(true)

const showFormModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const errors = ref({})

const showDeleteModal = ref(false)
const selectedCategory = ref(null)

const form = reactive({
  id: null,
  name: '',
  slug: ''
})

const fetchCategories = async () => {
  loading.value = true
  await categoryStore.fetchCategories()
  loading.value = false
}

onMounted(() => {
  fetchCategories()
})

const openCreateModal = () => {
  isEdit.value = false
  form.id = null
  form.name = ''
  form.slug = ''
  errors.value = {}
  showFormModal.value = true
}

const openEditModal = (category) => {
  isEdit.value = true
  form.id = category.id
  form.name = category.name
  form.slug = category.slug || ''
  errors.value = {}
  showFormModal.value = true
}

const openDeleteModal = (category) => {
  selectedCategory.value = category
  showDeleteModal.value = true
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}
  
  try {
    if (isEdit.value) {
      await api.put(API.ADMIN.CATEGORIES.UPDATE(form.id), form)
      toast.success('Category updated')
    } else {
      await api.post(API.ADMIN.CATEGORIES.STORE, form)
      toast.success('Category created')
    }
    showFormModal.value = false
    fetchCategories()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { message: 'Failed to save category.' }
    }
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async () => {
  submitting.value = true
  try {
    await api.delete(API.ADMIN.CATEGORIES.DESTROY(selectedCategory.value.id))
    toast.success('Category deleted')
    showDeleteModal.value = false
    fetchCategories()
  } catch {
    toast.error('Failed to delete category')
  } finally {
    submitting.value = false
  }
}
</script>
