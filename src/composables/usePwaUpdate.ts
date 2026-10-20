import { ref } from 'vue'

const updateAvailable = ref(false)
let registration: ServiceWorkerRegistration | null = null

export function usePwaUpdate() {
  function onNeedRefresh(reg: ServiceWorkerRegistration) {
    registration = reg
    updateAvailable.value = true
  }

  function applyUpdate() {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      updateAvailable.value = false
      window.location.reload()
    }
  }

  function dismissUpdate() {
    updateAvailable.value = false
  }

  return { updateAvailable, onNeedRefresh, applyUpdate, dismissUpdate }
}
