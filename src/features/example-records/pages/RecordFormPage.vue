<template>
  <ion-page>
    <PageHeader
      :title="isEditing ? 'Editar registro' : 'Novo registro'"
      show-back
      back-href="/records"
    >
      <template #actions>
        <ion-buttons slot="end">
          <ion-button :disabled="saving" @click="handleSave">
            <strong>Salvar</strong>
          </ion-button>
        </ion-buttons>
      </template>
    </PageHeader>
    <ion-content class="ion-padding">
      <form class="form-container" @submit.prevent="handleSave">
        <div class="form-field">
          <label for="title" class="form-label">
            Título <span class="required">*</span>
          </label>
          <ion-input
            id="title"
            v-model="form.title"
            placeholder="Nome do registro"
            :class="{ 'has-error': errors.title }"
            @ion-blur="validateField('title')"
          />
          <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
        </div>

        <div class="form-field">
          <label for="description" class="form-label">Descrição</label>
          <ion-textarea
            id="description"
            v-model="form.description"
            placeholder="Detalhes sobre o registro (opcional)"
            :auto-grow="true"
            :rows="3"
            :maxlength="500"
            :counter="true"
            @ion-blur="validateField('description')"
          />
          <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
        </div>

        <div v-if="isEditing" class="form-field">
          <label class="form-label">Estado</label>
          <ion-segment v-model="form.status">
            <ion-segment-button value="active">
              <ion-label>Ativo</ion-label>
            </ion-segment-button>
            <ion-segment-button value="archived">
              <ion-label>Arquivado</ion-label>
            </ion-segment-button>
          </ion-segment>
        </div>

        <div v-if="saveError" class="save-error">
          <ion-icon :icon="alertCircleOutline" />
          {{ saveError }}
        </div>

        <div v-if="savedLocally" class="save-success">
          <ion-icon :icon="checkmarkCircleOutline" />
          Salvo neste dispositivo
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonInput,
  IonTextarea,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from '@ionic/vue'
import { alertCircleOutline, checkmarkCircleOutline } from 'ionicons/icons'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import { recordFormSchema } from '../schemas/record.schema'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const savedLocally = ref(false)
const saveError = ref('')

const form = reactive({
  title: '',
  description: '',
  status: 'active' as 'active' | 'archived',
})

const errors = reactive<Record<string, string>>({
  title: '',
  description: '',
})

function validateField(field: 'title' | 'description') {
  const result = recordFormSchema.safeParse(form)
  if (!result.success) {
    const fieldError = result.error.issues.find((i) => i.path[0] === field)
    errors[field] = fieldError?.message ?? ''
  } else {
    errors[field] = ''
  }
}

async function handleSave() {
  const result = recordFormSchema.safeParse(form)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string
      if (field in errors) errors[field] = issue.message
    }
    return
  }

  saving.value = true
  saveError.value = ''
  savedLocally.value = false

  try {
    if (isEditing.value) {
      await exampleRecordRepository.update(route.params.id as string, {
        title: form.title,
        description: form.description,
        status: form.status,
      })
    } else {
      await exampleRecordRepository.create({
        title: form.title,
        description: form.description,
      })
    }
    savedLocally.value = true
    setTimeout(() => router.back(), 600)
  } catch (err) {
    saveError.value =
      err instanceof Error ? err.message : 'Falha ao salvar. Verifique o armazenamento.'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (isEditing.value) {
    const record = await exampleRecordRepository.getById(route.params.id as string)
    if (record) {
      form.title = record.title
      form.description = record.description
      form.status = record.status
    }
  }
})
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-field {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
}

.required {
  color: var(--color-error);
}

.has-error {
  --border-color: var(--color-error);
}

.field-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--space-1);
}

.save-error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: color-mix(in srgb, var(--color-error) 10%, transparent);
  color: var(--color-error);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.save-success {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: color-mix(in srgb, var(--color-success) 10%, transparent);
  color: var(--color-success);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}
</style>
