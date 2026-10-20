<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonList,
  IonNote,
} from '@ionic/vue';
import type { ExampleRecord } from '../types/example-record';
import { exampleRecordFormSchema } from '../schemas/example-record.schema';
import { formatZodErrors } from '../../../core/validation';

const props = defineProps<{
  record?: ExampleRecord;
}>();

const emit = defineEmits<{
  save: [data: { title: string; description: string }];
  cancel: [];
}>();

const title = ref(props.record?.title ?? '');
const description = ref(props.record?.description ?? '');
const errors = ref<Record<string, string[]>>({});

watch(
  () => props.record,
  (r) => {
    title.value = r?.title ?? '';
    description.value = r?.description ?? '';
    errors.value = {};
  },
);

function handleSave() {
  const data = { title: title.value.trim(), description: description.value.trim() };
  const validation = exampleRecordFormSchema.safeParse(data);
  if (!validation.success) {
    errors.value = formatZodErrors(validation.error);
    return;
  }
  errors.value = {};
  emit('save', data);
}
</script>

<template>
  <IonHeader>
    <IonToolbar>
      <template #start>
        <IonButtons>
          <IonButton @click="$emit('cancel')"> Cancelar </IonButton>
        </IonButtons>
      </template>
      <IonTitle>{{ record ? 'Editar Registro' : 'Novo Registro' }}</IonTitle>
      <template #end>
        <IonButtons>
          <IonButton strong @click="handleSave"> Salvar </IonButton>
        </IonButtons>
      </template>
    </IonToolbar>
  </IonHeader>
  <IonContent class="ion-padding">
    <IonList>
      <IonItem :class="{ 'ion-invalid': errors['title'] }">
        <IonLabel position="stacked"> Título * </IonLabel>
        <IonInput
          v-model="title"
          placeholder="Digite o título"
          :maxlength="200"
          aria-label="Título do registro"
          @ion-input="errors['title'] = []"
        />
        <template #error>
          <IonNote v-if="errors['title']?.length" color="danger">
            {{ errors['title'][0] }}
          </IonNote>
        </template>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked"> Descrição </IonLabel>
        <IonTextarea
          v-model="description"
          placeholder="Digite uma descrição (opcional)"
          :maxlength="2000"
          :rows="4"
          aria-label="Descrição do registro"
        />
        <template #error>
          <IonNote v-if="errors['description']?.length" color="danger">
            {{ errors['description'][0] }}
          </IonNote>
        </template>
      </IonItem>
    </IonList>
  </IonContent>
</template>
