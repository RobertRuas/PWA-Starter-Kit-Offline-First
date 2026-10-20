<script setup lang="ts">
import { IonChip, IonIcon, IonLabel } from '@ionic/vue';
import { cloudOfflineOutline, cloudDoneOutline } from 'ionicons/icons';
import { useConnectivity } from '../../core/network/connectivity';

const { isOnline } = useConnectivity();
</script>

<template>
  <IonChip :color="isOnline ? 'success' : 'medium'" outline>
    <IonIcon :icon="isOnline ? cloudDoneOutline : cloudOfflineOutline" />
    <IonLabel>{{ isOnline ? 'Online' : 'Offline' }}</IonLabel>
  </IonChip>
</template>
