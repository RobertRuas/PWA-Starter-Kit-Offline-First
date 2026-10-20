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
        <div class="form-card">
          <div class="form-row">
            <label for="title" class="form-row-label">
              Título <span class="required">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="form-row-input"
              :class="{ 'has-error': errors.title }"
              placeholder="Nome do registro"
              @blur="validateField('title')"
            />
          </div>
          <div class="form-divider" />
          <div class="form-row">
            <label for="description" class="form-row-label">Descrição</label>
            <textarea
              id="description"
              v-model="form.description"
              class="form-row-input form-row-textarea"
              placeholder="Opcional"
              rows="3"
              maxlength="500"
              @blur="validateField('description')"
            />
          </div>
        </div>
        <p v-if="errors.title" class="field-error">{{ errors.title }}</p>
        <p v-if="errors.description" class="field-error">{{ errors.description }}</p>
        <p class="form-hint">{{ form.description.length }} / 500</p>

        <div v-if="isEditing" class="form-card">
          <div class="form-row">
            <label class="form-row-label">Estado</label>
            <ion-segment v-model="form.status" class="form-segment">
              <ion-segment-button value="active">
                <ion-label>Ativo</ion-label>
              </ion-segment-button>
              <ion-segment-button value="archived">
                <ion-label>Arquivado</ion-label>
              </ion-segment-button>
            </ion-segment>
          </div>
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

.form-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-3);
}

.form-row {
  display: flex;
  align-items: flex-start;
  padding: var(--space-3) var(--space-4);
  min-height: var(--touch-target-min);
}

.form-row-label {
  flex-shrink: 0;
  width: 90px;
  font-size: var(--font-size-input);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  padding-top: 2px;
  line-height: 1.4;
}

.required {
  color: var(--color-error);
}

.form-row-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-input);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  line-height: 1.4;
  padding: 0;
}

.form-row-input::placeholder {
  color: var(--color-text-muted);
}

.form-row-input.has-error {
  color: var(--color-error);
}

.form-row-textarea {
  resize: none;
}

.form-divider {
  height: 1px;
  background: var(--color-border-light);
  margin-left: var(--space-4);
}

.form-hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  text-align: right;
  padding: 0 var(--space-4);
  margin-bottom: var(--space-4);
}

.form-segment {
  flex: 1;
}

.field-error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  padding: 0 var(--space-4);
  margin-top: calc(-1 * var(--space-2));
  margin-bottom: var(--space-2);
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
