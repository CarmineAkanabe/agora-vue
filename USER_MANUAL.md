# Agora: Comprehensive User & Architecture Manual

This document serves as the definitive reference manual for the internal operations, state machines, and architectural paradigms governing the Agora frontend application. It is required reading for engineers contributing to the codebase or administrators overseeing the platform.

---

## Section 1: Core Operational Paradigms

### 1.1 Identity & Access Management (IAM)
Agora enforces a strict bipartite role system governed by an explicit verification state machine.

1. **Unverified Student Segment**:
   - Accounts created via the public registration portal.
   - **Capabilities**: Can browse public marketplace listings and update their profile.
   - **Restrictions**: Strictly prohibited from initiating purchase requests, creating listings, or engaging in the escrow flow. They are persistently redirected to the `PendingVerification` dashboard until an administrator approves their submitted credentials.

2. **Verified Student Segment**:
   - Accounts whose `is_verified` flag has been toggled to `true` by an administrator after an audit of their ID and university email.
   - **Capabilities**: Full access to the peer-to-peer marketplace.

3. **Administrator Segment**:
   - High-privilege accounts bypassing standard verification barriers.
   - **Capabilities**: Complete oversight of the platform. Admins operate within the `/admin` routing namespace to review verifications, moderate listings, track financial metrics, and arbitrate disputes.

### 1.2 The Escrow Transaction State Machine
The core mechanism protecting users is the Escrow Transaction Flow. It follows a rigid state machine across multiple database entities:

1. **Request Creation (`pending`)**: A buyer triggers a `PurchaseRequest` for a target listing.
2. **Seller Adjudication (`approved` | `rejected`)**: The seller reviews the request. If rejected, the flow terminates. If approved, the request is locked, and the transaction enters the financial phase.
3. **Payment Initiation (`initiated`)**: The buyer is prompted to execute payment via the mobile money provider (K-PAY). A `Transaction` record is created with the status `initiated`. The frontend actively polls the backend during this phase until the webhook confirms the deposit.
4. **Funds Secured (`held`)**: Upon payment confirmation, the funds are safely secured in the platform's escrow wallet. A secure **Pickup Code** is cryptographically generated and displayed exclusively to the buyer.
5. **Physical Exchange & Cryptographic Verification (`released`)**: The buyer and seller meet physically. The buyer inspects the item. Upon satisfaction, the buyer verbally provides the Pickup Code to the seller. The seller inputs this code into the `PickupCodeForm.vue` component. The backend verifies the code, transitions the transaction to `released`, and automatically dispatches the escrowed funds to the seller's mobile money account.
6. **Dispute Arbitration (`open` | `closed`)**: If the transaction breaks down (e.g., defective item, no-show), either party may trigger a dispute from the `TransactionDetail.vue` view. This action suspends the transaction. Administrators review the context via `DisputeDetail.vue` and manually issue a resolution.

---

## Section 2: Architectural Breakdown & File Topology

The repository adheres strictly to the Vue 3 Composition API standard, enforcing a clean separation of concerns where UI rendering is decoupled from state management and API interfacing.

### 2.1 The Global Design System (`src/assets/main.css`)
Rather than saturating components with repetitive, verbose Tailwind CSS strings, Agora utilizes a central design system.
- **CSS Variables**: All colors, typographies, and spatial units are defined as CSS variables (e.g., `--color-surface-2`, `--spacing-6`).
- **Semantic Utilities**: Custom utility classes (e.g., `.glass-card`, `.btn-primary`, `.badge-success`) combine raw Tailwind directives with customized transitions and shadows to guarantee a uniform, premium aesthetic.

### 2.2 Layout Orchestration (`src/layouts/`)
- **`AuthLayout.vue`**: A minimal, distraction-free container engineered exclusively for the onboarding and authentication flows.
- **`PublicLayout.vue`**: The primary wrapper for the application. It maintains the global header/footer structure and manages the responsive flex-grid logic that hosts the router views.

### 2.3 Router Configuration (`src/router/index.js`)
The central nervous system of the application. It employs extensive **Navigation Guards**:
- **Authentication Guards**: Validates the presence of a valid JWT before granting access to `/student/*` or `/admin/*` routes.
- **Verification Guards**: Intercepts unverified students attempting to access restricted actions and reroutes them to the verification upload portal.
- **Role Guards**: Prevents non-administrative users from breaching the `/admin` prefix.

### 2.4 State Management Core (`src/stores/`)
Pinia stores are heavily utilized to manage complex API interactions and cache responses, minimizing redundant network requests.
- **`useAuthStore.js`**: Maintains the persistence of the JWT token and the reactive state of the currently authenticated user session.
- **`useListingStore.js`**: Operates the complex querying engine for the marketplace, handling debounced search inputs, category filtering, and pagination parameters.
- **`useRequestStore.js`**: Encapsulates the logic for the `PurchaseRequest` lifecycle.
- **`useTransactionStore.js`**: Houses the critical escrow logic. It notably contains the polling mechanism (`startPolling`, `stopPolling`) required to listen for asynchronous payment confirmations during the `initiated` phase.
- **`useDashboardStore.js` & `useAdminStore.js`**: Responsible for aggregating and normalizing complex statistical datasets utilized by the ApexCharts components.

### 2.5 Component Library (`src/components/`)
Components are strictly designed to be "dumb" (presentation-only) wherever possible, receiving data via `props` and broadcasting actions via `emits`.
- **`/ui/`**: The atomic building blocks. These files (`Button.vue`, `Modal.vue`, `Input.vue`) are agnostic to business logic and purely rely on the `main.css` design system.
- **`/transactions/`**: High-complexity components. For example, `TransactionTimeline.vue` visually parses the state machine, while `MakePaymentModal.vue` interfaces directly with the K-PAY integration.
- **`/listings/`**: Handles the varied states of marketplace items, including skeleton loaders during network latency.

### 2.6 View Controllers (`src/pages/`)
Views act as the orchestrators. They bind the Pinia stores to the localized UI components.
- **`/public/`**: Accessible without strict verification. Handles landing pages, generic browsing (`Browse.vue`), and public item details (`ListingDetail.vue`).
- **`/student/`**: The core operational views for verified users. This includes inventory management (`MyListings.vue`), the active escrow queue (`Transactions.vue`), and the resolution dashboard (`Disputes.vue`).
- **`/admin/`**: High-density data views for administrators. `VerificationDetail.vue` provides the interface for auditing student IDs, while `DisputeDetail.vue` acts as the command center for arbitrating frozen escrow funds.

### 2.7 Utility Layer (`src/utils/`)
- **`api.js`**: The foundational Axios instance. It applies global interceptors to automatically attach the `Bearer` token to headers and seamlessly intercepts `401 Unauthorized` responses to purge dead sessions and redirect to the login portal.
- **`constants.js`**: Stores static mapping objects (e.g., converting backend status strings like `'held'` into frontend-friendly UI variants and labels).
- **`formatters.js`**: Pure functions responsible for data localization, ensuring consistent formatting for dates, and correctly appending the FCFA currency suffix.
