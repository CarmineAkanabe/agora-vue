// ============================================================
// Agora — App-wide Constants
// Single source of truth for all fixed values.
// Never hardcode these anywhere else in the app.
// ============================================================

// ============================================================
// API Endpoints
// Mirrors the Laravel API routes exactly.
// ============================================================

export const API = {

  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN:    '/auth/login',
    LOGOUT:   '/auth/logout',
  },

  // Student Profile
  PROFILE: {
    CREATE: '/student/profile',
    SHOW:   '/student/profile',
    UPDATE: '/student/profile/update',
  },

  // Categories
  CATEGORIES: {
    INDEX: '/categories',
  },

  // Listings
  LISTINGS: {
    INDEX:         '/listings',
    SHOW:          (id)      => `/listings/${id}`,
    STORE:         '/listings',
    UPDATE:        (id)      => `/listings/${id}/update`,
    DESTROY:       (id)      => `/listings/${id}`,
    TOGGLE_STATUS: (id)      => `/listings/${id}/toggle-status`,
    SELLER:        (userId)  => `/sellers/${userId}`,
  },

  // Listing Images
  LISTING_IMAGES: {
    STORE:       (listingId)           => `/listings/${listingId}/images`,
    DESTROY:     (listingId, imageId)  => `/listings/${listingId}/images/${imageId}`,
    SET_PRIMARY: (listingId, imageId)  => `/listings/${listingId}/images/${imageId}/primary`,
  },

  // Purchase Requests
  REQUESTS: {
    STORE:    '/requests',
    SENT:     '/requests/sent',
    RECEIVED: '/requests/received',
    SHOW:     (id) => `/requests/${id}`,
    APPROVE:  (id) => `/requests/${id}/approve`,
    REJECT:   (id) => `/requests/${id}/reject`,
    CANCEL:   (id) => `/requests/${id}/cancel`,
  },

  // Transactions
  TRANSACTIONS: {
    STORE: '/transactions',
    INDEX: '/transactions',
    SHOW:  (id) => `/transactions/${id}`,
  },

  // Pickup Code
  PICKUP_CODE: {
    VERIFY: (transactionId) => `/transactions/${transactionId}/verify-code`,
  },

  // Reviews
  REVIEWS: {
    STORE:  '/reviews',
    SELLER: (userId) => `/reviews/seller/${userId}`,
  },

  // Disputes
  DISPUTES: {
    STORE: '/disputes',
    INDEX: '/disputes',
    SHOW:  (id) => `/disputes/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    INDEX:        '/notifications',
    READ:         (uuid) => `/notifications/${uuid}/read`,
    READ_ALL:     '/notifications/read-all',
    DESTROY:      (uuid) => `/notifications/${uuid}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
  },

  // Admin
  ADMIN: {

    VERIFICATIONS: {
      INDEX:   '/admin/verifications',
      SHOW:    (id) => `/admin/verifications/${id}`,
      APPROVE: (id) => `/admin/verifications/${id}/approve`,
      REJECT:  (id) => `/admin/verifications/${id}/reject`,
    },

    USERS: {
      INDEX: '/admin/users',
      SHOW:  (id) => `/admin/users/${id}`,
      BAN:   (id) => `/admin/users/${id}/ban`,
      UNBAN: (id) => `/admin/users/${id}/unban`,
      DESTROY: (id) => `/admin/users/${id}`,
    },

    LISTINGS: {
      INDEX:  '/admin/listings',
      REMOVE: (id) => `/admin/listings/${id}/remove`,
    },

    DISPUTES: {
      INDEX:   '/admin/disputes',
      SHOW:    (id) => `/admin/disputes/${id}`,
      RESOLVE: (id) => `/admin/disputes/${id}/resolve`,
      CLOSE:   (id) => `/admin/disputes/${id}/close`,
    },

    CATEGORIES: {
      STORE:   '/admin/categories',
      UPDATE:  (id) => `/admin/categories/${id}`,
      DESTROY: (id) => `/admin/categories/${id}`,
    },

    REPORTS: {
      OVERVIEW:     '/admin/reports/overview',
      TRANSACTIONS: '/admin/reports/transactions',
      LISTINGS:     '/admin/reports/listings',
      USERS:        '/admin/reports/users',
    },

  },

}

// ============================================================
// Enum Labels
// Maps raw API enum values to human-readable display strings.
// ============================================================

export const LISTING_CONDITION_LABELS = {
  new:      'New',
  like_new: 'Like New',
  good:     'Good',
  fair:     'Fair',
}

export const LISTING_STATUS_LABELS = {
  active:  'Active',
  paused:  'Paused',
  sold:    'Sold',
  removed: 'Removed',
}

export const REQUEST_STATUS_LABELS = {
  pending:   'Pending',
  approved:  'Approved',
  rejected:  'Rejected',
  expired:   'Expired',
  paid:      'Paid',
  completed: 'Completed',
  disputed:  'Disputed',
  cancelled: 'Cancelled',
}

export const TRANSACTION_STATUS_LABELS = {
  initiated: 'Processing',
  held:      'In Escrow',
  released:  'Completed',
  refunded:  'Refunded',
  failed:    'Failed',
}

export const PAYMENT_METHOD_LABELS = {
  mtn:    'MTN Mobile Money',
  orange: 'Orange Money',
}

export const VERIFICATION_STATUS_LABELS = {
  pending:  'Pending Review',
  approved: 'Verified',
  rejected: 'Rejected',
}

export const DISPUTE_STATUS_LABELS = {
  open:     'Open',
  resolved: 'Resolved',
  closed:   'Closed',
}

// ============================================================
// Enum Badge Variants
// Maps raw enum values to Badge.vue variant prop values.
// ============================================================

export const REQUEST_STATUS_VARIANTS = {
  pending:   'warning',
  approved:  'info',
  rejected:  'danger',
  expired:   'danger',
  paid:      'info',
  completed: 'success',
  disputed:  'danger',
  cancelled: 'danger',
}

export const TRANSACTION_STATUS_VARIANTS = {
  initiated: 'info',
  held:      'warning',
  released:  'success',
  refunded:  'info',
  failed:    'danger',
}

export const VERIFICATION_STATUS_VARIANTS = {
  pending:  'warning',
  approved: 'success',
  rejected: 'danger',
}

export const DISPUTE_STATUS_VARIANTS = {
  open:     'danger',
  resolved: 'success',
  closed:   'info',
}

export const LISTING_STATUS_VARIANTS = {
  active:  'success',
  paused:  'warning',
  sold:    'info',
  removed: 'danger',
}

// ============================================================
// Listing Conditions — for select dropdowns
// ============================================================

export const LISTING_CONDITIONS = [
  { value: 'new',      label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good',     label: 'Good' },
  { value: 'fair',     label: 'Fair' },
]

// ============================================================
// Payment Methods — for select dropdowns
// ============================================================

export const PAYMENT_METHODS = [
  { value: 'mtn',    label: 'MTN Mobile Money' },
  { value: 'orange', label: 'Orange Money' },
]

// ============================================================
// Sort Options — for listing browse
// ============================================================

export const LISTING_SORT_OPTIONS = [
  { value: '-created_at', label: 'Newest First' },
  { value: 'created_at',  label: 'Oldest First' },
  { value: 'price',       label: 'Price: Low to High' },
  { value: '-price',      label: 'Price: High to Low' },
]

// ============================================================
// Pagination
// ============================================================

export const PER_PAGE = 12

// ============================================================
// Notification Types
// Maps API notification type values to display labels.
// ============================================================

export const NOTIFICATION_LABELS = {
  verification_approved: 'Account Verified',
  verification_rejected: 'Verification Rejected',
  request_approved:      'Request Approved',
  request_rejected:      'Request Rejected',
  payment_initiated:     'Payment Processing',
  payment_held:          'Payment Confirmed',
  payment_failed:        'Payment Failed',
  pickup_code_verified:  'Pickup Code Verified',
  escrow_released:       'Payment Released',
  dispute_raised:        'Dispute Raised',
  dispute_resolved:      'Dispute Resolved',
  account_banned:        'Account Banned',
}

// ============================================================
// Local Storage Keys
// Never hardcode these strings anywhere else.
// ============================================================

export const STORAGE_KEYS = {
  TOKEN: 'agora_token',
  USER:  'agora_user',
}

// ============================================================
// App Info
// ============================================================

export const APP = {
  NAME:    'Agora',
  TAGLINE: 'The verified campus marketplace.',
  VERSION: '1.0.0',
}
