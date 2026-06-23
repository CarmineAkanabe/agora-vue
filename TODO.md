# Agora Vue Frontend TODO

This TODO is for building the full Agora Vue frontend against the documented Laravel API.

Important constraints:
- Do not use placeholder/mock/nameplate data for real app screens. Fetch from the API through stores/composables.
- Preserve the current dark/glassmorphic theme in `src/assets/main.css`.
- Follow the existing atomic/component pattern:
  - `components/ui` for reusable atoms.
  - domain components in `components/listings`, `components/requests`, etc.
  - page orchestration in `pages`.
  - API state/actions in Pinia stores.
  - reusable logic in `composables`.
- Keep all API endpoint constants in `src/utils/constants.js`.
- Keep formatting helpers in `src/utils/formatters.js`.
- Fill `src/utils/validators.js`.
- Prefer existing components before creating new ones.
- Do not import raw `axios`; use `src/plugins/axios.js`.
- After every phase: pause, run tests/build/lint, inspect UI, then continue.

## Phase 1: Project Cleanup And Baseline Verification

Tasks:
- Confirm the app installs and runs with the current `package.json`.
- Run `npm install` if dependencies are missing.
- Run `npm run build` to establish current breakages.
- Run `npm run lint` if possible and note failures.
- Confirm `VITE_API_BASE_URL=http://localhost:8000/api` in `.env`.
- Do not delete `base.css` yet, but note that `main.css` is the active theme.
- Check `index.html` and update title later from `Vite App` to `Agora` in the implementation phase.
- Identify every zero-byte file and treat them as scaffold files to implement.

Pause and test:
- Run `npm run build`.
- Run `npm run lint`.
- Start dev server with `npm run dev`.
- Open the app and confirm current routes render without unexpected crashes.

## Phase 2: Shared Utilities, Validators, And API Error Handling

Tasks:
- Implement `src/utils/validators.js`.
- Add validators for:
  - required fields.
  - email.
  - password length/confirmation.
  - Cameroonian phone-like numbers used by MTN/Orange.
  - matricule.
  - image file type.
  - image file size.
  - numeric price.
  - positive integer quantity.
  - pickup code: exactly 6 digits.
  - rating: 1 to 5.
- Fix corrupted display characters in `formatters.js` such as `â€”`, `â€¦`, and comment arrows.
- Add a reusable API error helper if needed, for converting Laravel 422 errors into field messages.
- Review `multipart()` in `src/plugins/axios.js`; ensure arrays like `images` become `images[]`, but scalar fields remain scalar.
- Avoid broad redesign here.

Pause and test:
- Run `npm run build`.
- Run `npm run lint`.
- Manually import validators in a temporary mental check only; do not create test data screens yet.

## Phase 3: Auth Store, App Boot, Guards, And Notifications Lifecycle

Tasks:
- Fix `useAuthStore.refreshUser()` behavior.
- Ensure admins do not call `/student/profile` in a way that causes bad state.
- For students:
  - If profile exists, refresh profile from `/student/profile`.
  - If profile does not exist, gracefully keep user logged in and route to pending verification/profile creation.
- Add route guard handling for banned users if backend returns `is_banned`.
- Fix guest redirect:
  - Admin goes to `admin-dashboard`.
  - Verified student goes to `dashboard`.
  - Unverified student goes to `pending-verification`.
- Start notification polling after login/app refresh for authenticated users.
- Stop notification polling on logout.
- Ensure auth state survives page refresh.
- Ensure 401 interceptor clears local session cleanly without redirect loops.

Pause and test:
- Run `npm run build`.
- Test login as seeded admin.
- Test login as seeded verified student.
- Test register new student and confirm pending verification route.
- Test logout.

## Phase 4: Core Layout And Navigation Polish

Tasks:
- Keep `PublicLayout.vue` and `AuthLayout.vue`.
- Preserve glassy sticky navbar.
- Fix any corrupted characters in nav labels/comments.
- Make mobile nav route behavior reliable.
- Ensure `NotificationDropdown` only renders for authenticated users.
- Implement `NotificationItem.vue` before dropdown renders real notifications.
- Make `ProfileMenu` robust if `auth.user.profile` is missing.
- Update `index.html` title to `Agora`.
- Consider removing/ignoring `base.css` only if safe; do not import it.

Pause and test:
- Run `npm run build`.
- Resize desktop/mobile.
- Check public nav logged out.
- Check auth nav as student.
- Check auth nav as admin.

## Phase 5: Atomic UI Completion And Theme Consistency

Tasks:
- Review all components in `components/ui`.
- Fix unstable generated IDs in `Input.vue`, `Select.vue`, and `Textarea.vue`; IDs should not change on re-render.
- Ensure buttons support router links and disabled/loading states correctly.
- Ensure modal can be used with `useConfirm`.
- Keep card radius consistent with existing theme unless intentionally glassmorphic.
- Add a glass utility class to `main.css` if needed, for example `.glass-card`, but avoid scattering arbitrary styles everywhere.
- Avoid overusing decorative blur blobs; current auth/pending pages already use some.
- Keep colors from `main.css` tokens.

Pause and test:
- Run `npm run build`.
- Run `npm run lint`.
- Manually inspect login/register/pending verification forms.

## Phase 6: Categories And Public Marketplace Browse

Tasks:
- Implement `FilterSidebar.vue`.
- Implement `ListingCard.vue`.
- Implement `ListingGrid.vue`.
- Implement `Browse.vue`.
- Use `useCategoryStore.fetchCategories()` for categories.
- Use `useListingStore.fetchListings()` for listings.
- Wire API query params exactly as docs:
  - `filter[category_id]`
  - `filter[condition]`
  - `filter[title]`
  - `filter[price_between]`
  - `sort`
  - `page`
- Use `useDebounce` for title search.
- Add pagination controls from API `meta`.
- Use `SkeletonLoader` while loading.
- Use empty states if no listings.
- Use real listing images from API.
- Never hardcode listing examples.

Pause and test:
- Run `npm run build`.
- Start backend if available.
- Open `/listings`.
- Test category filter.
- Test condition filter.
- Test title search.
- Test price range.
- Test sort.
- Test pagination.

## Phase 7: Public Home, About, Listing Detail, Seller Profile

Tasks:
- Implement `Home.vue` as a usable marketplace entry, not a pure marketing page.
- Home should fetch real categories and latest listings from API.
- Implement `About.vue` with concise platform explanation, no fake stats unless fetched.
- Implement `ImageGallery.vue`.
- Implement `SellerInfo.vue`.
- Implement `RatingStars.vue`.
- Implement `ReviewCard.vue`.
- Implement `ListingDetail.vue`:
  - Fetch listing by ID.
  - Show images, category, seller, condition, price, quantity, description.
  - If logged in and verified student, show purchase request form.
  - If own listing, do not show request form.
- Implement `SellerProfile.vue`:
  - Fetch seller listings via `/sellers/{user_id}`.
  - Fetch seller reviews via `/reviews/seller/{user_id}`.
  - Show average rating and total reviews from API.

Pause and test:
- Run `npm run build`.
- Open `/`.
- Open `/about`.
- Open `/listings/:id`.
- Open `/sellers/:id`.
- Test listing detail while logged out.
- Test listing detail while logged in.

## Phase 8: Student Profile And Verification Flow

Tasks:
- Improve `ProfileForm.vue`.
- Use `UiSelect` for level.
- Use validators from `validators.js`.
- Validate ID card max 2MB.
- Validate profile picture max 1MB.
- Show selected file names/previews.
- Keep multipart upload to:
  - `POST /student/profile`
  - `POST /student/profile/update`
- Implement `MyProfile.vue`.
- Implement `VerificationStatus.vue`.
- Ensure updating profile resets status display to pending.
- After profile create/update, update `auth.user.profile`.
- Pending verification page should handle:
  - no profile.
  - pending profile.
  - rejected profile.
  - approved profile redirect to dashboard.

Pause and test:
- Run `npm run build`.
- Register a new student.
- Create profile with ID card.
- Test rejected profile update if backend data available.
- Test My Profile page.

## Phase 9: Listing Create/Edit/My Listings

Tasks:
- Implement `ImageUploader.vue` using `useImageUpload`.
- Implement `ListingForm.vue`.
- Implement `CreateListing.vue`.
- Implement `EditListing.vue`.
- Implement `MyListings.vue`.
- Use categories from API.
- Use listing conditions from constants.
- Create listing via `POST /listings` multipart:
  - `category_id`
  - `title`
  - `description`
  - `price`
  - `quantity`
  - `condition`
  - `images[]`
  - `primary_image`
- Update listing via `POST /listings/{id}/update`.
- For `MyListings`, do not rely on undocumented `filter[mine]` unless backend confirms it.
- If no documented my-listings endpoint exists, decide one of:
  - ask backend to add endpoint.
  - use existing authenticated listings endpoint if backend supports `filter[mine]`.
  - derive from seller endpoint with current user ID, but note it only returns active listings per docs.
- Implement toggle status and delete.
- Use confirm modal before destructive actions.

Pause and test:
- Run `npm run build`.
- Create listing with 1 image.
- Create listing with 5 images.
- Test validation on missing fields.
- Edit listing.
- Toggle active/paused.
- Delete listing.

## Phase 10: Purchase Request Flow

Tasks:
- Implement `RequestStatusBadge.vue`.
- Implement `RequestForm.vue`.
- Implement `RequestCard.vue`.
- Implement `SentRequests.vue`.
- Implement `ReceivedRequests.vue`.
- Implement `RequestDetail.vue`.
- Submit request via `POST /requests`.
- Fetch sent requests via `GET /requests/sent`.
- Fetch received requests via `GET /requests/received`.
- Fetch detail via `GET /requests/{id}`.
- Seller actions:
  - approve via `POST /requests/{id}/approve`.
  - reject via `POST /requests/{id}/reject` with optional reason.
- Buyer action:
  - cancel via `POST /requests/{id}/cancel`.
- Show `expires_at` countdown for approved requests.
- Show payment CTA only for approved requests where current user is buyer.
- Avoid allowing buyer to request own listing.

Pause and test:
- Run `npm run build`.
- As buyer, submit request on another seller listing.
- As seller, view received request.
- Approve request.
- Reject request.
- Cancel request.
- Open request detail from both buyer and seller accounts.

## Phase 11: Transactions, Payment Initiation, Escrow, Pickup Code

Tasks:
- Implement `TransactionCard.vue`.
- Implement `TransactionTimeline.vue`.
- Implement `EscrowStatus.vue`.
- Implement `PickupCodeDisplay.vue`.
- Implement `PickupCodeForm.vue`.
- Implement `Transactions.vue`.
- Implement `TransactionDetail.vue`.
- Initiate payment via `POST /transactions` with:
  - `purchase_request_id`
  - `payment_method`
  - `buyer_phone`
- Use payment methods from constants.
- After initiating payment, use store polling to refresh transaction status.
- Buyer should see pickup code only if backend includes it.
- Seller should see pickup code verification form for held transactions.
- Verify code via `POST /transactions/{id}/verify-code`.
- Stop polling when transaction is no longer `initiated`.
- Make K-PAY uncertainty visible with careful UI copy, but do not fake payment success.

Pause and test:
- Run `npm run build`.
- Initiate payment for approved request.
- Confirm transaction appears in `/transactions`.
- Confirm transaction detail works.
- Test frontend polling.
- Test pickup code verification if backend supports it.

## Phase 12: Reviews And Disputes

Tasks:
- Implement `ReviewForm.vue`.
- Complete `ReviewCard.vue` and `RatingStars.vue`.
- Add review creation where transaction is `released` and current user is buyer.
- Submit review via `POST /reviews`.
- Implement dispute creation UI.
- Implement `useDisputeStore` screens:
  - list my disputes.
  - dispute detail if a student route is desired.
- The router currently has no student dispute route; add one if needed.
- Raise dispute via `POST /disputes`.
- Fetch my disputes via `GET /disputes`.
- Fetch single dispute via `GET /disputes/{id}`.
- Only allow disputes for held transactions.

Pause and test:
- Run `npm run build`.
- Leave a review on released transaction.
- View seller reviews.
- Raise dispute on held transaction.
- View dispute list/detail.

## Phase 13: Notifications Full Page And Dropdown

Tasks:
- Implement `NotificationItem.vue`.
- Implement `NotificationList.vue`.
- Implement `Notifications.vue`.
- Fetch notifications via `GET /notifications`.
- Show unread count from API response if available, or computed store count.
- Mark one notification read via `POST /notifications/{uuid}/read`.
- Mark all read via `POST /notifications/read-all`.
- Delete notification via `DELETE /notifications/{uuid}`.
- Remember notification IDs are UUIDs.
- Make dropdown show latest 10 notifications.
- Make full page show all notifications.
- Ensure polling starts/stops with auth lifecycle.

Pause and test:
- Run `npm run build`.
- Open notification dropdown.
- Mark one as read.
- Mark all as read.
- Delete notification.
- Open `/notifications`.

## Phase 14: Student Dashboard

Tasks:
- Implement `StatsCard.vue`.
- Implement `RecentActivity.vue`.
- Implement `TransactionSummary.vue`.
- Implement `SalesChart.vue` only if real API data supports it.
- Implement `Dashboard.vue`.
- Fetch dashboard stats via `GET /dashboard/stats`.
- Show:
  - total listings.
  - active listings.
  - total sales.
  - total earned.
  - total purchases.
  - total spent.
  - pending requests.
  - average rating.
  - total reviews.
- Add links to:
  - create listing.
  - my listings.
  - sent requests.
  - received requests.
  - transactions.
  - profile.
- Do not invent chart series if endpoint does not provide them.

Pause and test:
- Run `npm run build`.
- Open `/dashboard` as verified student.
- Confirm stats come from API.
- Confirm empty/missing stats do not crash UI.

## Phase 15: Admin Verifications And Users

Tasks:
- Implement `VerificationCard.vue`.
- Implement `Verifications.vue`.
- Implement `VerificationDetail.vue`.
- Implement `UserCard.vue`.
- Implement `Users.vue`.
- Implement `UserDetail.vue`.
- Fetch pending verifications via `GET /admin/verifications`.
- Fetch verification detail via `GET /admin/verifications/{profile_id}`.
- Approve via `POST /admin/verifications/{profile_id}/approve`.
- Reject via `POST /admin/verifications/{profile_id}/reject` with optional reason.
- Fetch users via `GET /admin/users`.
- Fetch user detail via `GET /admin/users/{user_id}`.
- Ban via `POST /admin/users/{user_id}/ban`.
- Unban via `POST /admin/users/{user_id}/unban`.
- Show student profile, ID card image, status, and account state.
- Use confirm modal for approve/reject/ban/unban.

Pause and test:
- Run `npm run build`.
- Login as admin.
- Open admin verifications.
- Approve a student.
- Reject a student.
- Open users.
- Ban/unban a student.

## Phase 16: Admin Listings, Disputes, Reports, Categories

Tasks:
- Implement admin `Listings.vue`.
- Implement `DisputeCard.vue`.
- Implement admin `Disputes.vue`.
- Implement admin `DisputeDetail.vue`.
- Implement `ReportChart.vue`.
- Implement admin `Reports.vue`.
- Fetch admin listings via `GET /admin/listings`.
- Remove listing via `POST /admin/listings/{listing_id}/remove` with optional reason.
- Fetch all disputes via `GET /admin/disputes`.
- Fetch dispute detail via `GET /admin/disputes/{dispute_id}`.
- Resolve dispute via `POST /admin/disputes/{dispute_id}/resolve`.
- Close dispute via `POST /admin/disputes/{dispute_id}/close`.
- Fetch reports:
  - overview.
  - transactions.
  - listings.
  - users.
- Add category management only if there is a clear page/control:
  - create category.
  - update category.
  - delete category.
- Use ApexCharts only with real report data.

Pause and test:
- Run `npm run build`.
- Open admin listings.
- Remove listing.
- Open admin disputes.
- Resolve dispute.
- Close dispute.
- Open reports.
- Verify charts/tables handle empty data.

## Phase 17: Route Completeness And Empty File Audit

Tasks:
- Re-run file inventory and confirm no page/component route target is zero-byte.
- Confirm every router path renders meaningful UI.
- Confirm all imported components have a template/script or are intentionally renderless.
- Remove unused default Vue icons/components only if not referenced.
- Remove `counter.js` if unused.
- Decide what to do with `base.css`:
  - keep unimported if harmless.
  - or delete if user approves cleanup.
- Ensure all corrupted encoding text is fixed.

Pause and test:
- Run `npm run build`.
- Run `npm run lint`.
- Navigate every route manually.
- Test hard refresh on every main route.

## Phase 18: Accessibility, Responsive QA, And UX States

Tasks:
- Check keyboard focus on nav, dropdowns, forms, modals.
- Ensure modals close correctly.
- Ensure dropdowns close on outside click.
- Ensure images have useful alt text.
- Ensure forms have labels and error messages.
- Ensure loading states exist for every API screen.
- Ensure empty states exist for every collection screen.
- Ensure error states exist for failed API calls.
- Check mobile layout for:
  - auth pages.
  - browse.
  - listing detail.
  - dashboards.
  - admin tables/cards.
- Keep text inside containers and buttons.
- Avoid UI overlap.

Pause and test:
- Run `npm run build`.
- Test at mobile width around 375px.
- Test tablet width around 768px.
- Test desktop width around 1280px.

## Phase 19: Final API Contract Review

Tasks:
- Compare every store action against `_AGORA_API_DOCUMENTATION.md`.
- Confirm all paths match constants.
- Confirm multipart endpoints use `multipart/form-data`.
- Confirm JSON endpoints use JSON.
- Confirm request body field names match docs.
- Confirm resource response shapes are handled:
  - plain arrays.
  - `{ data, meta }` pagination.
  - `{ unread_count, notifications }`.
  - `{ message, transaction }`.
- Remove/replace any unsupported endpoint assumptions.
- Document any backend endpoint gaps in this TODO or a separate note.

Pause and test:
- Run end-to-end manual flow:
  - register.
  - create profile.
  - admin approves.
  - create listing.
  - browse listing.
  - submit request.
  - seller approves.
  - buyer initiates payment.
  - view transaction.
  - verify pickup code if available.
  - review or dispute.

## Phase 20: Final Build, Lint, And Delivery Notes

Tasks:
- Run `npm run build`.
- Run `npm run lint`.
- Fix any build/lint issues caused by implementation.
- Start `npm run dev`.
- Provide the local URL.
- Summarize completed flows.
- Summarize known backend-dependent limitations, especially K-PAY.
- Summarize any endpoints that were missing or assumed.
- Ensure no placeholder data remains in production screens.

Pause and test:
- Final browser smoke test.
- Final console check for runtime errors.
- Final route navigation pass.

