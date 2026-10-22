<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; text-align: center; gap: 0.5rem;">
    <i class="pi pi-exclamation-circle" style="font-size: 4rem; color: var(--p-red-500); margin-bottom: 0.5rem;" />
    <h3 style="margin: 0;">{{ title }}</h3>
    <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
      <p style="color: var(--p-text-muted-color); margin: 0; max-width: 280px;">{{ description }}</p>
      <Button
        v-if="description"
        icon="pi pi-copy"
        text
        rounded
        size="small"
        title="Copiar mensagem"
        @click="copyToClipboard"
      />
    </div>
    <Button v-if="retryLabel" :label="retryLabel" outlined size="small" @click="$emit('retry')" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'

const toast = useToast()

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    retryLabel?: string
  }>(),
  {
    title: 'Algo deu errado',
    description: 'Nao foi possivel completar a operacao.',
    retryLabel: '',
  },
)

defineEmits<{
  retry: []
}>()

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(props.description)
    toast.add({ severity: 'success', summary: 'Copiado!', life: 2000 })
  } catch (err) {
    console.error('Erro ao copiar:', err)
  }
}
</script>
