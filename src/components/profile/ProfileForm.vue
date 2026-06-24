<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UiInput
        id="matricule"
        v-model="form.matricule"
        label="Matricule"
        placeholder="22T1234"
        :error="errors.matricule"
        required
      />
      <UiInput
        id="school"
        v-model="form.school"
        label="School/Institution"
        placeholder="ENSP"
        :error="errors.school"
        required
      />
      <UiInput
        id="department"
        v-model="form.department"
        label="Department"
        placeholder="Computer Engineering"
        :error="errors.department"
        required
      />

      <div class="input-wrapper">
        <label for="level" class="label">Level <span class="input-required">*</span></label>
        <select
          id="level"
          v-model="form.level"
          class="input"
          required
          :class="{ 'input-error': errors.level }"
        >
          <option value="" disabled>Select Level</option>
          <option value="L1">L1</option>
          <option value="L2">L2</option>
          <option value="L3">L3</option>
          <option value="M1">M1</option>
          <option value="M2">M2</option>
        </select>
        <span v-if="errors.level" class="error-message">{{ errors.level }}</span>
      </div>

      <UiInput
        id="phone"
        v-model="form.phone"
        type="tel"
        label="MoMo / OM Number"
        placeholder="655000000"
        :error="errors.phone"
        required
      />
      <UiInput
        id="whatsapp_number"
        v-model="form.whatsapp_number"
        type="tel"
        label="WhatsApp Number"
        placeholder="655000000"
        :error="errors.whatsapp_number"
        required
      />
    </div>

    <div class="space-y-4 pt-4 border-t border-border">
      <div v-if="!isUpdate">
        <label class="label">Student ID Card Photo <span class="input-required">*</span></label>
        <p class="text-xs text-text-3 mb-2">
          Upload a clear photo of your student ID (Max 2MB, Images only)
        </p>
        <input
          type="file"
          ref="idCardInput"
          accept="image/*"
          class="w-full text-sm text-text-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-ghost file:text-primary hover:file:bg-primary/20"
          :required="!isUpdate"
          @change="onIdCardChange"
        />
        <span v-if="errors.id_card" class="error-message block mt-1">{{ errors.id_card }}</span>
      </div>

      <div>
        <label class="label">Profile Picture (Optional)</label>
        <input
          type="file"
          ref="profilePicInput"
          accept="image/*"
          class="w-full text-sm text-text-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-surface-3 file:text-text-1 hover:file:bg-border"
          @change="onProfilePicChange"
        />
        <span v-if="errors.profile_picture" class="error-message block mt-1">{{
          errors.profile_picture
        }}</span>
      </div>
    </div>

    <div
      v-if="errors.message"
      class="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm"
    >
      {{ errors.message }}
    </div>

    <div class="pt-6">
      <UiButton type="submit" variant="primary" block :loading="loading" class="h-12 text-base">
        {{ isUpdate ? 'Update Profile' : 'Submit for Verification' }}
      </UiButton>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import api, { extractApiErrors, multipart } from '@/plugins/axios'
import { API } from '@/utils/constants'
import {
  firstError,
  imageFile,
  matricule,
  phone,
  required,
  validateFields,
} from '@/utils/validators'
import UiInput from '@/components/ui/Input.vue'
import UiButton from '@/components/ui/Button.vue'

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
})

const auth = useAuthStore()
const loading = ref(false)
const errors = ref({})

const isUpdate = computed(() => !!props.initialData.id)

const form = reactive({
  matricule: props.initialData.matricule || '',
  school: props.initialData.school || '',
  department: props.initialData.department || '',
  level: props.initialData.level || '',
  phone: props.initialData.phone || '',
  whatsapp_number: props.initialData.whatsapp_number || '',
})

const idCardFile = ref(null)
const profilePicFile = ref(null)

const onIdCardChange = (event) => {
  idCardFile.value = event.target.files[0]
}

const onProfilePicChange = (event) => {
  profilePicFile.value = event.target.files[0]
}

const validateForm = () => {
  const schema = {
    matricule: [(value) => required(value, 'Matricule'), (value) => matricule(value, 'Matricule')],
    school: [(value) => required(value, 'School/Institution')],
    department: [(value) => required(value, 'Department')],
    level: [(value) => required(value, 'Level')],
    phone: [(value) => required(value, 'Phone number'), (value) => phone(value, 'Phone number')],
    whatsapp_number: [
      (value) => required(value, 'WhatsApp number'),
      (value) => phone(value, 'WhatsApp number'),
    ],
  }

  const validationErrors = validateFields(schema, form)

  if (!isUpdate.value) {
    const idCardErr = firstError(
      required(idCardFile.value, 'Student ID card'),
      imageFile(idCardFile.value, 2, 'Student ID card'),
    )
    if (idCardErr !== true) validationErrors.id_card = idCardErr
  }

  if (profilePicFile.value) {
    const picErr = firstError(
      imageFile(profilePicFile.value, 1, 'Profile picture'),
    )
    if (picErr !== true) validationErrors.profile_picture = picErr
  }

  errors.value = validationErrors
  return Object.keys(validationErrors).length === 0
}

const handleSubmit = async () => {
  loading.value = true
  errors.value = {}

  if (!validateForm()) {
    loading.value = false
    return
  }

  const payload = {
    ...form,
    id_card: idCardFile.value ?? null,
    profile_picture: profilePicFile.value ?? null,
  }

  try {
    const endpoint = isUpdate.value ? API.PROFILE.UPDATE : API.PROFILE.CREATE
    const { data } = await api.post(endpoint, multipart(payload), {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    auth.updateUser({ ...auth.user, profile: data })
  } catch (error) {
    errors.value = extractApiErrors(error, 'Something went wrong. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
