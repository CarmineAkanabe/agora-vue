import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards'

// ============================================================
// Agora — Router
// Routes are grouped by layout and access level.
// Lazy loaded with meaningful chunk names for debugging.
// ============================================================

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  // Scroll to top on every navigation
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),

  routes: [

    // ----------------------------------------------------------
    // Public Routes — PublicLayout
    // No authentication required
    // ----------------------------------------------------------
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/public/Home.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/pages/public/About.vue'),
        },
        {
          path: 'listings',
          name: 'browse',
          component: () => import('@/pages/public/Browse.vue'),
        },
        {
          path: 'listings/:id',
          name: 'listing-detail',
          component: () => import('@/pages/public/ListingDetail.vue'),
          props: true,
        },
        {
          path: 'sellers/:id',
          name: 'seller-profile',
          component: () => import('@/pages/public/SellerProfile.vue'),
          props: true,
        },
      ],
    },

    // ----------------------------------------------------------
    // Guest Only Routes — PublicLayout
    // Redirect to /dashboard if already logged in
    // ----------------------------------------------------------
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/pages/auth/Login.vue'),
          meta: { guestOnly: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/pages/auth/Register.vue'),
          meta: { guestOnly: true },
        },
      ],
    },

    // ----------------------------------------------------------
    // Auth — Pending Verification — AuthLayout
    // Logged in but not yet verified
    // ----------------------------------------------------------
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'pending-verification',
          name: 'pending-verification',
          component: () => import('@/pages/student/PendingVerification.vue'),
        },
      ],
    },

    // ----------------------------------------------------------
    // Student Routes — AuthLayout
    // Requires auth + verified student
    // ----------------------------------------------------------
    {
      path: '/',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { requiresAuth: true, requiresVerified: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/pages/student/Dashboard.vue'),
        },
        {
          path: 'my-listings',
          name: 'my-listings',
          component: () => import('@/pages/student/MyListings.vue'),
        },
        {
          path: 'listings/create',
          name: 'create-listing',
          component: () => import('@/pages/student/CreateListing.vue'),
        },
        {
          path: 'listings/:id/edit',
          name: 'edit-listing',
          component: () => import('@/pages/student/EditListing.vue'),
          props: true,
        },
        {
          path: 'requests/sent',
          name: 'sent-requests',
          component: () => import('@/pages/student/SentRequests.vue'),
        },
        {
          path: 'requests/received',
          name: 'received-requests',
          component: () => import('@/pages/student/ReceivedRequests.vue'),
        },
        {
          path: 'requests/:id',
          name: 'request-detail',
          component: () => import('@/pages/student/RequestDetail.vue'),
          props: true,
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/pages/student/Transactions.vue'),
        },
        {
          path: 'transactions/:id',
          name: 'transaction-detail',
          component: () => import('@/pages/student/TransactionDetail.vue'),
          props: true,
        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('@/pages/student/Notifications.vue'),
        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/pages/student/MyProfile.vue'),
        },
      ],
    },

    // ----------------------------------------------------------
    // Admin Routes — AuthLayout
    // Requires auth + admin role
    // ----------------------------------------------------------
    {
      path: '/admin',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          redirect: { name: 'admin-dashboard' },
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/pages/admin/Dashboard.vue'),
        },
        {
          path: 'verifications',
          name: 'admin-verifications',
          component: () => import('@/pages/admin/Verifications.vue'),
        },
        {
          path: 'verifications/:id',
          name: 'admin-verification-detail',
          component: () => import('@/pages/admin/VerificationDetail.vue'),
          props: true,
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/pages/admin/Users.vue'),
        },
        {
          path: 'users/:id',
          name: 'admin-user-detail',
          component: () => import('@/pages/admin/UserDetail.vue'),
          props: true,
        },
        {
          path: 'listings',
          name: 'admin-listings',
          component: () => import('@/pages/admin/Listings.vue'),
        },
        {
          path: 'disputes',
          name: 'admin-disputes',
          component: () => import('@/pages/admin/Disputes.vue'),
        },
        {
          path: 'disputes/:id',
          name: 'admin-dispute-detail',
          component: () => import('@/pages/admin/DisputeDetail.vue'),
          props: true,
        },
        {
          path: 'reports',
          name: 'admin-reports',
          component: () => import('@/pages/admin/Reports.vue'),
        },
      ],
    },

    // ----------------------------------------------------------
    // 404 — catch all
    // ----------------------------------------------------------
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/public/Home.vue'),
      redirect: { name: 'home' },
    },

  ],
})

// ============================================================
// Global Navigation Guard
// ============================================================

router.beforeEach(authGuard)

export default router
