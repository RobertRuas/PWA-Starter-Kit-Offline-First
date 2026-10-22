<template>
  <div>
    <PageHeader
      :title="isEditing ? 'Editar registro' : 'Novo registro'"
      show-back
      back-href="/records"
    >
      <template #actions>
        <Button label="Salvar" text :disabled="saving" @click="handleSave" />
      </template>
    </PageHeader>
    <div style="max-width: 600px; margin: 0 auto; padding: 1rem;">
      <form @submit.prevent="handleSave">
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem;">
          <div class="p-fluid">
            <label for="title">Titulo *</label>
            <InputText
              id="title"
              v-model="form.title"
              placeholder="Nome do registro"
              :invalid="!!errors.title"
              @blur="validateField('title')"
            />
            <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
          </div>

          <div class="p-fluid">
            <label for="description">Descricao</label>
            <Textarea
              id="description"
              v-model="form.description"
              placeholder="Opcional"
              rows="3"
              :maxlength="500"
              @blur="validateField('description')"
            />
            <small v-if="errors.description" class="p-error">{{ errors.description }}</small>
            <small style="display: block; text-align: right; color: var(--p-text-muted-color);">{{ form.description.length }} / 500</small>
          </div>

          <div v-if="isEditing" class="p-fluid">
            <label>Estado</label>
            <SelectButton
              v-model="form.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
            />
          </div>
        </div>

        <Message v-if="saveError" severity="error" :closable="false">
          {{ saveError }}
        </Message>

        <Message v-if="savedLocally" severity="success" :closable="false">
          Salvo neste dispositivo
        </Message>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import SelectButton from 'primevue/selectbutton'
import Message from 'primevue/message'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import { recordFormSchema } from '../schemas/record.schema'

const route = useRoute()
const router = useRouter()

const isEditing = computed(() => !!route.params.id)
const saving = ref(false)
const savedLocally = ref(false)
const saveError = ref('')

const statusOptions = [
  { label: 'Ativo', value: 'active' },
  { label: 'Arquivado', value: 'archived' },
]

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
