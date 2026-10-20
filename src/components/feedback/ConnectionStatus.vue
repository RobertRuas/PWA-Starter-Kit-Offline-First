<template>
  <div class="connection-status" :class="{ offline: !isOnline }">
    <ion-icon :icon="isOnline ? cloudDoneOutline : cloudOfflineOutline" />
    <span class="connection-label">{{ isOnline ? 'Online' : 'Offline' }}</span>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { cloudDoneOutline, cloudOfflineOutline } from 'ionicons/icons'
import { useConnectivity } from '../../core/network/connectivity'

const { isOnline } = useConnectivity()
</script>

<style scoped>
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-sm);
  color: var(--color-success);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
}

.connection-status.offline {
  color: var(--color-warning);
  background: color-mix(in srgb, var(--color-warning) 10%, transparent);
}

.connection-label {
  font-weight: var(--font-weight-medium);
}
</style>
