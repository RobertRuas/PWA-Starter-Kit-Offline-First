<template>
  <div class="empty-state">
    <ion-icon v-if="icon" :icon="icon" class="empty-icon" />
    <p class="empty-title">{{ title }}</p>
    <p v-if="description" class="empty-description">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue'

defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}

.empty-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.empty-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  max-width: 280px;
}
</style>
