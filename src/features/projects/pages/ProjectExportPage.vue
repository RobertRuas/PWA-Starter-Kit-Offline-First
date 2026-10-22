<template>
  <div>
    <PageHeader title="Exportar" />

    <div class="export-content">
      <Card v-if="project">
        <template #title>Resumo</template>
        <template #content>
          <div class="summary-grid">
            <div class="summary-item">
              <span class="summary-label">Projeto</span>
              <span class="summary-value">{{ project.name }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Fotos</span>
              <span class="summary-value">{{ totalCount }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Categorias</span>
              <span class="summary-value">{{ categories.length }}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Por categorizar</span>
              <span class="summary-value">{{ inboxCount }}</span>
            </div>
          </div>
        </template>
      </Card>

      <div class="export-actions">
        <Button
          label="Baixar ZIP"
          icon="pi pi-download"
          :loading="exporting"
          @click="handleDownload"
        />
        <Button
          v-if="canShare"
          label="Compartilhar"
          icon="pi pi-share-alt"
          outlined
          :loading="sharing"
          @click="handleShare"
        />
      </div>

      <div v-if="exporting" class="export-progress">
        <i class="pi pi-spin pi-spinner" />
        <span>Preparando arquivo...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { projectRepository } from '../../../core/database/repositories/project.repository'
import { useErrorToast } from '../../../composables/useErrorToast'
import type { Project, PhotoCategory } from '../../../core/database/db'

const props = defineProps<{ id: string }>()
const { showError, showSuccess } = useErrorToast()

const project = ref<Project | undefined>()
const categories = ref<PhotoCategory[]>([])
const totalCount = ref(0)
const inboxCount = ref(0)
const exporting = ref(false)
const sharing = ref(false)

const canShare = computed(() => !!navigator.share)

async function loadData() {
  project.value = await projectRepository.getProject(props.id)
  categories.value = await projectRepository.getCategoriesForProject(props.id)
  totalCount.value = await projectRepository.getPhotoCountForProject(props.id)
  inboxCount.value = await projectRepository.getInboxCount(props.id)
}

async function buildZipBlob(): Promise<Blob> {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()

  const inboxPhotos = await projectRepository.getInboxPhotos(props.id)
  if (inboxPhotos.length > 0) {
    const folder = zip.folder('Inbox')!
    for (const photo of inboxPhotos) {
      folder.file(photo.filename, photo.blob)
    }
  }

  for (const cat of categories.value) {
    const photos = await projectRepository.getPhotosByCategory(cat.id)
    if (photos.length > 0) {
      const folder = zip.folder(cat.name)!
      for (const photo of photos) {
        folder.file(photo.filename, photo.blob)
      }
    }
  }

  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

async function handleDownload() {
  exporting.value = true
  try {
    const blob = await buildZipBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.value?.name ?? 'projeto'}.zip`
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('Download iniciado.')
  } catch {
    showError('Falha ao gerar arquivo.')
  } finally {
    exporting.value = false
  }
}

async function handleShare() {
  sharing.value = true
  try {
    const blob = await buildZipBlob()
    const file = new File([blob], `${project.value?.name ?? 'projeto'}.zip`, { type: 'application/zip' })
    await navigator.share({ files: [file] })
    showSuccess('Compartilhado.')
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      showError('Falha ao compartilhar.')
    }
  } finally {
    sharing.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.export-content {
  padding: 0 1.5rem 2rem;
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.summary-label {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

.summary-value {
  font-weight: 600;
  font-size: 0.9375rem;
}

.export-actions {
  display: flex;
  gap: 0.5rem;
}

.export-actions .p-button {
  flex: 1;
}

.export-progress {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: var(--p-primary-50);
  border-radius: var(--p-border-radius);
  font-size: 0.875rem;
  color: var(--p-primary-color);
}

@media (max-width: 640px) {
  .export-content {
    padding: 0 1rem 2rem;
  }
}
</style>
