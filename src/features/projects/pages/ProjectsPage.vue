<template>
  <div>
    <PageHeader title="Projetos" />

    <div class="projects-content">
      <div v-if="projects.length === 0 && !loading" class="empty-state">
        <i class="pi pi-folder-open empty-icon" />
        <p>Nenhum projeto criado</p>
        <Button label="Criar primeiro projeto" icon="pi pi-plus" @click="showNewDialog = true" />
      </div>

      <div v-else class="projects-grid">
        <Card
          v-for="project in projects"
          :key="project.id"
          class="project-card"
          @click="router.push(`/projects/${project.id}`)"
        >
          <template #content>
            <div class="project-card-body">
              <div class="project-card-info">
                <div class="project-card-name">{{ project.name }}</div>
                <div class="project-card-meta">
                  <span>{{ photoCounts[project.id] ?? 0 }} fotos</span>
                  <span class="meta-sep">·</span>
                  <span>{{ formatDate(project.createdAt) }}</span>
                </div>
              </div>
              <i class="pi pi-chevron-right project-card-arrow" />
            </div>
          </template>
        </Card>
      </div>

      <Button
        v-if="projects.length > 0"
        icon="pi pi-plus"
        rounded
        class="fab-btn"
        @click="showActionMenu = true"
      />
    </div>

    <!-- Action menu: New or Import -->
    <Dialog
      v-model:visible="showActionMenu"
      header="Novo projeto"
      :modal="true"
      :style="{ width: '320px' }"
    >
      <div class="action-menu-options">
        <Button
          label="Criar novo projeto"
          icon="pi pi-plus"
          class="action-menu-btn"
          @click="showActionMenu = false; showNewDialog = true"
        />
        <Button
          label="Importar projeto (ZIP)"
          icon="pi pi-upload"
          outlined
          class="action-menu-btn"
          @click="showActionMenu = false; triggerImportZip()"
        />
      </div>
    </Dialog>

    <!-- New project dialog -->
    <Dialog
      v-model:visible="showNewDialog"
      header="Criar projeto"
      :modal="true"
      :style="{ width: '320px' }"
    >
      <div class="new-project-form">
        <label for="project-name">Nome do projeto</label>
        <InputText
          id="project-name"
          v-model="newProjectName"
          placeholder="Ex: Inspecao 1"
          class="w-full"
          @keyup.enter="handleCreateProject"
        />
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showNewDialog = false" />
        <Button label="Criar" :disabled="!newProjectName.trim()" @click="handleCreateProject" />
      </template>
    </Dialog>

    <input
      ref="zipInput"
      type="file"
      accept=".zip"
      style="display: none"
      @change="handleImportZip"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { projectRepository } from '../../../core/database/repositories/project.repository'
import { useErrorToast } from '../../../composables/useErrorToast'
import type { Project } from '../../../core/database/db'

const router = useRouter()
const { showError, showSuccess } = useErrorToast()

const projects = ref<Project[]>([])
const photoCounts = ref<Record<string, number>>({})
const loading = ref(true)
const showActionMenu = ref(false)
const showNewDialog = ref(false)
const newProjectName = ref('')
const zipInput = ref<HTMLInputElement>()

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

async function loadProjects() {
  loading.value = true
  projects.value = await projectRepository.getAllProjects()
  const counts: Record<string, number> = {}
  for (const p of projects.value) {
    counts[p.id] = await projectRepository.getPhotoCountForProject(p.id)
  }
  photoCounts.value = counts
  loading.value = false
}

async function handleCreateProject() {
  const name = newProjectName.value.trim()
  if (!name) return
  const project = await projectRepository.createProject(name)
  showNewDialog.value = false
  newProjectName.value = ''
  router.push(`/projects/${project.id}`)
}

function triggerImportZip() {
  zipInput.value?.click()
}

async function handleImportZip(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''

  if (!file.name.endsWith('.zip')) {
    showError('Selecione um arquivo .zip valido.')
    return
  }

  try {
    const { importProjectFromZip } = await import('../../../core/image/zip-importer')
    const project = await importProjectFromZip(file)
    showSuccess('Projeto importado.')
    router.push(`/projects/${project.id}`)
  } catch (err) {
    showError(err instanceof Error ? err.message : 'Falha ao importar projeto.')
  }
}

onMounted(loadProjects)
</script>

<style scoped>
.projects-content {
  padding: 0 1.5rem 2rem;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  min-height: calc(100vh - 56px - 80px);
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

.empty-icon {
  font-size: 3rem;
  opacity: 0.4;
}

.projects-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-card {
  cursor: pointer;
  transition: background 0.15s;
}

.project-card:hover {
  background: var(--p-surface-50);
}

.project-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.project-card-info {
  min-width: 0;
}

.project-card-name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.project-card-meta {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
  margin-top: 0.125rem;
}

.meta-sep {
  margin: 0 0.25rem;
}

.project-card-arrow {
  color: var(--p-surface-400);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.fab-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-menu-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-menu-btn {
  width: 100%;
  justify-content: flex-start;
}

.new-project-form {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.new-project-form label {
  font-weight: 600;
  font-size: 0.875rem;
}

.w-full {
  width: 100%;
}

@media (max-width: 640px) {
  .projects-content {
    padding: 0 1rem 2rem;
  }
}
</style>
