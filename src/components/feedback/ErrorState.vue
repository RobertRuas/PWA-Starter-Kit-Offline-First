<template>
  <div class="error-state">
    <ion-icon :icon="alertCircleOutline" class="error-icon" />
    <h3>{{ title }}</h3>
    <div class="error-message-wrapper">
      <p>{{ description }}</p>
      <ion-button
        v-if="description"
        title="Copiar mensagem"
        size="small"
        fill="clear"
        @click="copyToClipboard"
      >
        <ion-icon slot="icon-only" :icon="copyOutline" />
      </ion-button>
    </div>
    <ion-button v-if="retryLabel" size="small" fill="outline" @click="$emit('retry')">
      {{ retryLabel }}
    </ion-button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonButton, toastController } from '@ionic/vue'
import { alertCircleOutline, copyOutline } from 'ionicons/icons'

const props = withDefaults(
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

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.description)
    const toast = await toastController.create({
      message: 'Mensagem copiada!',
      duration: 2000,
      color: 'success',
    })
    await toast.present()
  } catch (err) {
    console.error('Erro ao copiar:', err)
  }
}
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
  font-size: 64px;
  color: var(--color-error);
  margin-bottom: var(--space-2);
}

.error-state h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.error-message-wrapper {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
}

.error-state p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  max-width: 280px;
}

.error-message-wrapper ion-button {
  --padding-start: 0;
  --padding-end: 0;
  min-width: unset;
}
</style>
