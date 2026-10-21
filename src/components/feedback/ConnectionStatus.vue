<template>
  <span
    class="connection-status"
    :class="{ 'connection-status--offline': !isOnline || !isServerReachable }"
  >
    <ion-icon
      :icon="isOnline && isServerReachable ? cloudDoneOutline : cloudOfflineOutline"
      class="connection-status__icon"
      aria-hidden="true"
    />
    <span class="connection-status__label">
      {{ isOnline && isServerReachable ? 'Online' : 'Offline' }}
    </span>
  </span>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'
import { cloudDoneOutline, cloudOfflineOutline } from 'ionicons/icons'
import { useConnectivity } from '../../core/network/connectivity'

const { isOnline, isServerReachable } = useConnectivity()
</script>

<style scoped>
.connection-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-weight-medium);
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  margin-inline-end: 8px;
  transition:
    color 0.3s,
    background 0.3s;
}

.connection-status--offline {
  color: var(--color-text-muted);
  background: color-mix(in srgb, var(--color-text-muted) 10%, transparent);
}

.connection-status__icon {
  font-size: 14px;
}

.connection-status__label {
  line-height: 1;
}
</style>
