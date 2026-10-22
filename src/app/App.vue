<template>
  <Toast />
  <ConfirmDialog />
  <router-view />
  <div v-if="updateAvailable" class="update-banner">
    <span>Nova versao disponivel</span>
    <Button size="small" @click="applyUpdate">Atualizar</Button>
    <Button size="small" text @click="dismissUpdate">Depois</Button>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import Button from 'primevue/button'
import { usePwaUpdate } from '../composables/usePwaUpdate'
import { requestPersistentStorage } from '../core/storage/storage-manager'

const { updateAvailable, applyUpdate, dismissUpdate, onNeedRefresh } = usePwaUpdate()

onMounted(async () => {
  await requestPersistentStorage()

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.getRegistration()
    if (reg) {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              onNeedRefresh(reg)
            }
          })
        }
      })
    }
  }
})
</script>

<style scoped>
.update-banner {
  position: fixed;
  bottom: calc(56px + env(safe-area-inset-bottom, 0px));
  left: 16px;
  right: 16px;
  background: var(--p-primary-color);
  color: var(--p-primary-contrast-color);
  padding: 12px 16px;
  border-radius: var(--p-border-radius);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 9999;
}

.update-banner span {
  flex: 1;
}
</style>
