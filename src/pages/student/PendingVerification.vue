<template>
  <div class="pending-verification-page min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-surface-1">
    
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="container max-w-3xl relative z-10">
      
      <div v-if="isPending" class="card backdrop-blur-xl bg-surface-2/60 border border-white/5 shadow-2xl rounded-2xl p-10 text-center">
        <div class="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-text-1 mb-4">Verification Pending</h1>
        <p class="text-text-2 text-lg mb-8 max-w-xl mx-auto">
          Your profile has been submitted and is currently being reviewed by an administrator. 
          You will receive an email once your account is approved.
        </p>
        <div class="p-4 rounded-xl bg-surface-3 border border-border inline-block text-left">
          <p class="text-sm text-text-2"><strong class="text-text-1">Submitted on:</strong> {{ new Date(auth.user.profile.created_at).toLocaleDateString() }}</p>
          <p class="text-sm text-text-2"><strong class="text-text-1">Matricule:</strong> {{ auth.user.profile.matricule }}</p>
        </div>
      </div>

      <div v-else-if="isRejected" class="card backdrop-blur-xl bg-surface-2/60 border border-danger/20 shadow-2xl shadow-danger/5 rounded-2xl p-8 mb-8">
        <div class="flex items-start gap-4 mb-8 p-4 bg-danger/10 border border-danger/20 rounded-xl">
          <svg class="w-8 h-8 text-danger shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 class="text-lg font-bold text-danger mb-1">Verification Rejected</h3>
            <p class="text-text-2 text-sm">Please update your information and submit again.</p>
          </div>
        </div>

        <h2 class="text-2xl font-bold text-text-1 mb-6">Update Your Profile</h2>
        <ProfileForm :initial-data="auth.user.profile" />
      </div>

      <div v-else class="card backdrop-blur-xl bg-surface-2/60 border border-white/5 shadow-2xl rounded-2xl p-8 lg:p-10">
        <div class="mb-8 border-b border-border pb-6">
          <h1 class="text-3xl font-bold text-text-1 mb-2">Complete Your Profile</h1>
          <p class="text-text-2">To ensure a safe campus marketplace, we require all students to verify their identity before buying or selling items.</p>
        </div>
        
        <ProfileForm />
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import ProfileForm from '@/components/profile/ProfileForm.vue'

const auth = useAuthStore()

const hasProfile = computed(() => !!auth.user?.profile)
const isPending = computed(() => hasProfile.value && auth.user.profile.verification_status === 'pending')
const isRejected = computed(() => hasProfile.value && auth.user.profile.verification_status === 'rejected')
</script>
