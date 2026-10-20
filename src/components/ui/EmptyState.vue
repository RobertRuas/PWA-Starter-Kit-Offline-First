<script setup lang="ts">
import { IonIcon, IonButton } from '@ionic/vue';

defineProps<{
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
}>();

defineEmits<{
  action: [];
}>();
</script>

<template>
  <div class="empty-state">
    <IonIcon v-if="icon" :icon="icon" class="empty-state__icon" />
    <h3 class="empty-state__title">
      {{ title }}
    </h3>
    <p v-if="description" class="empty-state__description">
      {{ description }}
    </p>
    <IonButton v-if="actionLabel" fill="outline" @click="$emit('action')">
      {{ actionLabel }}
    </IonButton>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-md);
  text-align: center;
}

.empty-state__icon {
  font-size: 64px;
  color: var(--color-text-disabled);
  margin-bottom: var(--spacing-md);
}

.empty-state__title {
  margin: 0 0 var(--spacing-sm);
  font-size: var(--font-size-lg);
  color: var(--color-text-primary);
}

.empty-state__description {
  margin: 0 0 var(--spacing-lg);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  max-width: 300px;
}
</style>
