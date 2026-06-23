import { ref } from 'vue'

// ============================================================
// useConfirm
// Programmatic confirm modal trigger.
// Used for destructive actions: delete listing, ban user, etc.
//
// Usage in a component:
// const { confirmState, confirm } = useConfirm()
//
// confirm({
//   title:   'Delete Listing',
//   message: 'This action cannot be undone.',
//   variant: 'danger',
//   onConfirm: () => listingStore.destroyListing(id),
// })
//
// In template, pass confirmState to Modal.vue:
// <Modal v-if="confirmState.open" v-bind="confirmState" />
// ============================================================

export const useConfirm = () => {

  const confirmState = ref({
    open:      false,
    title:     '',
    message:   '',
    variant:   'danger',
    loading:   false,
    onConfirm: null,
  })

  const confirm = ({ title, message, variant = 'danger', onConfirm }) => {
    confirmState.value = {
      open: true,
      title,
      message,
      variant,
      loading: false,
      onConfirm,
    }
  }

  const handleConfirm = async () => {
    if (!confirmState.value.onConfirm) return
    confirmState.value.loading = true

    try {
      await confirmState.value.onConfirm()
    } finally {
      close()
    }
  }

  const close = () => {
    confirmState.value = {
      open:      false,
      title:     '',
      message:   '',
      variant:   'danger',
      loading:   false,
      onConfirm: null,
    }
  }

  return {
    confirmState,
    confirm,
    handleConfirm,
    close,
  }
}
