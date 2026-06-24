<template>
  <section class="container section space-y-6">
    <div class="glass-card p-8">
      <p class="text-sm uppercase tracking-[0.3em] text-accent">My profile</p>
      <h1 class="mt-2 text-3xl font-bold text-text-1">Profile details</h1>
      <p class="mt-3 text-lg text-text-2">
        Update your verification profile and personal information here.
      </p>
    </div>

    <div class="space-y-4">
      <VerificationStatus :status="auth.user?.profile?.verification_status || 'pending'" />
      <div class="card">
        <ProfileForm :initial-data="auth.user?.profile || {}" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import ProfileForm from '@/components/profile/ProfileForm.vue'
import VerificationStatus from '@/components/profile/VerificationStatus.vue'

const auth = useAuthStore()
</script>
