import { useAuthStore } from '@/stores/useAuthStore'

// ============================================================
// Agora — Route Guards
// Applied per route via meta fields.
// meta.requiresAuth     → must be logged in
// meta.requiresVerified → must be logged in + verified student
// meta.requiresAdmin    → must be logged in + admin role
// meta.guestOnly        → redirect to /dashboard if logged in
// ============================================================

/**
 * Main navigation guard.
 * Runs before every route change.
 */
export const authGuard = (to, from, next) => {
  const auth = useAuthStore()

  // Guest only routes (login, register)
  // Redirect already logged-in users away
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next({ name: 'dashboard' })
  }

  // Requires authentication
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }

  // Requires admin role
  if (to.meta.requiresAdmin) {
    if (!auth.isLoggedIn) {
      return next({ name: 'login' })
    }
    if (!auth.isAdmin) {
      return next({ name: 'dashboard' })
    }
  }

  // Requires verified student
  if (to.meta.requiresVerified) {
    if (!auth.isLoggedIn) {
      return next({ name: 'login' })
    }
    if (!auth.isVerified) {
      return next({ name: 'pending-verification' })
    }
  }

  next()
}
