<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';
import { alertCircleOutline } from 'ionicons/icons';

defineProps<{
  title?: string;
  message: string;
  retryLabel?: string;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="error-state">
    <IonIcon :icon="alertCircleOutline" class="error-state__icon" />
    <h3 class="error-state__title">
      {{ title ?? 'Algo deu errado' }}
    </h3>
    <p class="error-state__message">
      {{ message }}
    </p>
    <IonButton v-if="retryLabel" fill="outline" color="danger" @click="$emit('retry')">
      {{ retryLabel }}
    </IonButton>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  text-align: center;
}

.error-state__icon {
  font-size: 64px;
  color: var(--color-danger);
  margin-bottom: var(--spacing-md);
}

.error-state__title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.error-state__message {
  margin: 0 0 var(--spacing-lg);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  max-width: 300px;
}
</style>
