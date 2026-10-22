<template>
  <div>
    <PageHeader :title="project?.name ?? 'Projeto'" />

    <div v-if="project" class="project-content">
      <!-- Fotos por categorizar -->
      <Card v-if="inboxCount > 0" class="action-card" @click="goToTriage">
        <template #content>
          <div class="action-card-body">
            <i class="pi pi-inbox action-icon inbox-icon" />
            <div class="action-card-text">
              <div class="action-title">Fotos por categorizar</div>
              <div class="action-subtitle">{{ inboxCount }} fotos</div>
            </div>
            <i class="pi pi-chevron-right action-arrow" />
          </div>
        </template>
      </Card>

      <!-- Revisão -->
      <Card class="action-card" @click="goToReview">
        <template #content>
          <div class="action-card-body">
            <i class="pi pi-th-large action-icon review-icon" />
            <div class="action-card-text">
              <div class="action-title">Revisão</div>
              <div class="action-subtitle">{{ categorizedCount }} fotos categorizadas</div>
            </div>
            <i class="pi pi-chevron-right action-arrow" />
          </div>
        </template>
      </Card>

      <!-- Import photos -->
      <Button
        label="Importar fotos"
        icon="pi pi-images"
        class="import-btn"
        @click="triggerImport"
      />

      <!-- Export -->
      <Card class="action-card" @click="goToExport">
        <template #content>
          <div class="action-card-body">
            <i class="pi pi-download action-icon export-icon" />
            <div class="action-card-text">
              <div class="action-title">Exportar</div>
              <div class="action-subtitle">{{ totalCount }} fotos no projeto</div>
            </div>
            <i class="pi pi-chevron-right action-arrow" />
          </div>
        </template>
      </Card>

      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none"
        @change="handleFilesSelected"
      />

      <!-- Import progress -->
      <div v-if="importing" class="import-progress">
        <i class="pi pi-spin pi-spinner" />
        <span>Importando {{ importedCount }}/{{ totalImporting }} fotos...</span>
      </div>
    </div>

    <div v-else-if="!loading" class="empty-state">
      <p>Projeto nao encontrado.</p>
      <Button label="Voltar" icon="pi pi-arrow-left" text @click="router.push('/projects')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { projectRepository } from '../../../core/database/repositories/project.repository'
import { importPhotos } from '../../../core/image/photo-importer'
import { useErrorToast } from '../../../composables/useErrorToast'
import type { Project } from '../../../core/database/db'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { showError, showSuccess } = useErrorToast()

const project = ref<Project | undefined>()
const loading = ref(true)
const inboxCount = ref(0)
const categorizedCount = ref(0)
const totalCount = ref(0)

const fileInput = ref<HTMLInputElement>()
const importing = ref(false)
const importedCount = ref(0)
const totalImporting = ref(0)

async function loadData() {
  loading.value = true
  project.value = await projectRepository.getProject(props.id)
  if (project.value) {
    inboxCount.value = await projectRepository.getInboxCount(props.id)
    categorizedCount.value = await projectRepository.getCategorizedCount(props.id)
    totalCount.value = await projectRepository.getPhotoCountForProject(props.id)
  }
  loading.value = false
}

function goToTriage() {
  router.push(`/projects/${props.id}/triage`)
}

function goToReview() {
  router.push(`/projects/${props.id}/review`)
}

function goToExport() {
  router.push(`/projects/${props.id}/export`)
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  if (files.length === 0) return
  input.value = ''

  importing.value = true
  importedCount.value = 0
  totalImporting.value = files.length

  try {
    for (let i = 0; i < files.length; i++) {
      await importPhotos([files[i]], props.id, null)
      importedCount.value = i + 1
    }
    showSuccess(`${files.length} fotos importadas.`)
    await loadData()
  } catch {
    showError('Falha ao importar fotos.')
  } finally {
    importing.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.project-content {
  padding: 0 1.5rem 2rem;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-card {
  cursor: pointer;
  transition: background 0.15s;
}

.action-card:hover {
  background: var(--p-surface-50);
}

.action-card-body {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-icon {
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--p-border-radius);
  flex-shrink: 0;
}

.inbox-icon {
  background: var(--p-orange-50);
  color: var(--p-orange-500);
}

.review-icon {
  background: var(--p-primary-50);
  color: var(--p-primary-color);
}

.export-icon {
  background: var(--p-green-50);
  color: var(--p-green-600);
}

.action-card-text {
  flex: 1;
  min-width: 0;
}

.action-title {
  font-weight: 600;
  font-size: 0.9375rem;
}

.action-subtitle {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
  margin-top: 0.0625rem;
}

.action-arrow {
  color: var(--p-surface-400);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.import-btn {
  width: 100%;
}

.import-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--p-primary-50);
  border-radius: var(--p-border-radius);
  font-size: 0.875rem;
  color: var(--p-primary-color);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--p-text-muted-color);
}

@media (max-width: 640px) {
  .project-content {
    padding: 0 1rem 2rem;
  }
}
</style>
