<template>
  <div class="register-page min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-surface-1">
    
    <!-- Decorative background elements -->
    <div class="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent/20 rounded-full blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="w-full max-w-md">
      <!-- Logo / Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-text-1 mb-2 tracking-tight">Join Agora</h1>
        <p class="text-text-2">Create your student account</p>
      </div>

      <!-- Glassmorphism Card -->
      <div class="card relative overflow-hidden backdrop-blur-xl bg-surface-2/40 border border-white/5 shadow-2xl rounded-2xl p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <UiInput
            id="name"
            v-model="form.name"
            type="text"
            label="Full Name"
            placeholder="Alice Mboua"
            :error="auth.errors?.name?.[0]"
            required
          />

          <UiInput
            id="email"
            v-model="form.email"
            type="email"
            label="Email Address"
            placeholder="alice@agora.app"
            :error="auth.errors?.email?.[0]"
            required
          />

          <UiInput
            id="password"
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="••••••••"
            :error="auth.errors?.password?.[0]"
            required
          />

          <UiInput
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            required
          />

          <!-- Global Error -->
          <div v-if="auth.errors?.message" class="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            {{ auth.errors.message }}
          </div>

          <UiButton
            type="submit"
            variant="primary"
            block
            :loading="auth.loading"
            class="mt-4 h-12 text-base font-semibold"
          >
            Create Account
          </UiButton>
        </form>

        <div class="mt-8 text-center text-sm text-text-3">
          Already have an account? 
          <router-link :to="{ name: 'login' }" class="text-primary hover:text-primary-dim transition-colors font-medium">
            Sign in
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import UiInput from '@/components/ui/Input.vue'
import UiButton from '@/components/ui/Button.vue'

const auth = useAuthStore()

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  try {
    await auth.register(form)
  } catch {
    // Errors are handled in the store
  }
}
</script>

<style scoped>
.card {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>
