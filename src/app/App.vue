<template>
  <ion-app>
    <ion-router-outlet />
    <div v-if="updateAvailable" class="update-banner">
      <span>Nova versão disponível</span>
      <ion-button size="small" fill="solid" @click="applyUpdate">Atualizar</ion-button>
      <ion-button size="small" fill="clear" @click="dismissUpdate">Depois</ion-button>
    </div>
  </ion-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { IonApp, IonRouterOutlet, IonButton } from '@ionic/vue'
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
  left: var(--space-4);
  right: var(--space-4);
  background: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  z-index: 9999;
  box-shadow: var(--shadow-lg);
}

.update-banner span {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.update-banner ion-button {
  --color: white;
}
</style>
