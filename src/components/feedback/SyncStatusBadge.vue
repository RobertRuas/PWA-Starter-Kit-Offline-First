<script setup lang="ts">
import { IonBadge, IonIcon } from '@ionic/vue';
import { syncOutline, alertCircleOutline } from 'ionicons/icons';
import { useSyncStatus } from '../../core/sync/sync-status';
import { isFeatureEnabled } from '../../app/config/feature-flags';

const { pendingCount, failedOperations, isSyncing } = useSyncStatus();
const syncEnabled = isFeatureEnabled('sync');
</script>

<template>
  <div v-if="syncEnabled" class="sync-status">
    <IonBadge v-if="isSyncing" color="primary">
      <IonIcon :icon="syncOutline" />
      Sincronizando...
    </IonBadge>
    <IonBadge v-else-if="failedOperations.length > 0" color="danger">
      <IonIcon :icon="alertCircleOutline" />
      {{ failedOperations.length }} erro(s)
    </IonBadge>
    <IonBadge v-else-if="pendingCount > 0" color="warning">
      {{ pendingCount }} pendente(s)
    </IonBadge>
  </div>
</template>

<style scoped>
.sync-status ion-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
