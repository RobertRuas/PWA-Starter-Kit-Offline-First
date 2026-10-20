<script setup lang="ts">
import { IonIcon, IonNote } from '@ionic/vue';
import { checkmarkCircleOutline } from 'ionicons/icons';

defineProps<{
  savedAt?: string;
}>();
</script>

<template>
  <IonNote v-if="savedAt" color="success" class="save-status">
    <IonIcon :icon="checkmarkCircleOutline" />
    <span>Salvo neste dispositivo</span>
  </IonNote>
</template>

<style scoped>
.save-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-sm);
}
</style>
