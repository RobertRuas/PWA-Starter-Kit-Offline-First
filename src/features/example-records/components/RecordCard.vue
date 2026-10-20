<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonNote,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/vue';
import { trashOutline, createOutline } from 'ionicons/icons';
import type { ExampleRecord } from '../types/example-record';

defineProps<{
  record: ExampleRecord;
}>();

defineEmits<{
  edit: [id: string];
  delete: [id: string];
}>();

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<template>
  <IonItemSliding>
    <IonItem button @click="$emit('edit', record.id)">
      <IonLabel>
        <h2>{{ record.title }}</h2>
        <p v-if="record.description">
          {{ record.description }}
        </p>
        <IonNote>{{ formatDate(record.updatedAt) }}</IonNote>
      </IonLabel>
    </IonItem>
    <IonItemOptions side="end">
      <IonItemOption color="primary" @click="$emit('edit', record.id)">
        <template #icon-only>
          <IonIcon :icon="createOutline" />
        </template>
      </IonItemOption>
      <IonItemOption color="danger" @click="$emit('delete', record.id)">
        <template #icon-only>
          <IonIcon :icon="trashOutline" />
        </template>
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
</template>
