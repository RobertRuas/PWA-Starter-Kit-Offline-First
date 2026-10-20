<script setup lang="ts">
import { IonAlert } from '@ionic/vue';

const props = defineProps<{
  isOpen: boolean;
  header: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}>();

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const buttons = [
  {
    text: props.cancelLabel ?? 'Cancelar',
    role: 'cancel',
    handler: () => emit('cancel'),
  },
  {
    text: props.confirmLabel ?? 'Confirmar',
    role: props.destructive ? 'destructive' : 'confirm',
    handler: () => emit('confirm'),
  },
];
</script>

<template>
  <IonAlert
    :is-open="isOpen"
    :header="header"
    :message="message"
    :buttons="buttons"
    @did-dismiss="$emit('cancel')"
  />
</template>
