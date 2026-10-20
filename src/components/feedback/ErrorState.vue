<template>
  <div class="error-state">
    <ion-icon :icon="alertCircleOutline" class="error-icon" />
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <ion-button v-if="retryLabel" size="small" fill="outline" @click="$emit('retry')">
      {{ retryLabel }}
    </ion-button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue'
import { alertCircleOutline } from 'ionicons/icons'

withDefaults(
  defineProps<{
    title?: string
    description?: string
    retryLabel?: string
  }>(),
  {
    title: 'Algo deu errado',
    description: 'Não foi possível completar a operação.',
    retryLabel: '',
  },
)

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
  gap: var(--space-2);
}

.error-icon {
  font-size: 48px;
  color: var(--color-error);
  margin-bottom: var(--space-2);
}

.error-state h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.error-state p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 280px;
}
</style>
