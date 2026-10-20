<template>
  <div class="save-status" :class="statusClass">
    <ion-icon :icon="statusIcon" />
    <span>{{ statusText }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IonIcon } from '@ionic/vue'
import { checkmarkCircleOutline, syncOutline, alertCircleOutline } from 'ionicons/icons'

const props = defineProps<{
  status?: 'saved' | 'saving' | 'error'
}>()

const currentStatus = computed(() => props.status ?? 'saved')

const statusIcon = computed(() => {
  const icons: Record<string, string> = {
    saved: checkmarkCircleOutline,
    saving: syncOutline,
    error: alertCircleOutline,
  }
  return icons[currentStatus.value] ?? checkmarkCircleOutline
})

const statusText = computed(() => {
  const texts: Record<string, string> = {
    saved: 'Salvo neste dispositivo',
    saving: 'Salvando...',
    error: 'Falha ao salvar',
  }
  return texts[currentStatus.value] ?? ''
})

const statusClass = computed(() => `status-${currentStatus.value}`)
</script>

<style scoped>
.save-status {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
}

.save-status ion-icon {
  font-size: 14px;
}

.status-saved {
  color: var(--color-success);
}

.status-saving {
  color: var(--color-text-muted);
}

.status-error {
  color: var(--color-error);
}
</style>
