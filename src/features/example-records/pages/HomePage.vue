<template>
  <div>
    <PageHeader title="Inicio" subtitle="Gerencie seus projetos de inspeção" />

    <div class="home-content">
      <Card>
        <template #content>
          <div class="welcome-body">
            <div class="welcome-text">
              <div class="welcome-title">Bem-vindo</div>
              <div class="welcome-desc">
                Importe fotos, categorize e exporte projetos de inspeção organizados.
              </div>
            </div>
          </div>
        </template>
      </Card>

      <div class="quick-actions">
        <Button
          label="Meus projetos"
          icon="pi pi-folder"
          class="action-btn"
          @click="router.push('/projects')"
        />
        <Button
          label="Novo projeto"
          icon="pi pi-plus"
          outlined
          class="action-btn"
          @click="router.push('/projects')"
        />
      </div>

      <!-- Stats -->
      <div class="stats-row">
        <Card class="stat-card">
          <template #content>
            <div class="stat-body">
              <div class="stat-value">{{ projectCount }}</div>
              <div class="stat-label">Projetos</div>
            </div>
          </template>
        </Card>
        <Card class="stat-card">
          <template #content>
            <div class="stat-body">
              <div class="stat-value">{{ storageDisplay }}</div>
              <div class="stat-label">Armazenamento</div>
            </div>
          </template>
        </Card>
      </div>
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
import { getStorageEstimate, formatBytes } from '../../../core/storage/storage-manager'

const router = useRouter()
const projectCount = ref(0)
const storageDisplay = ref('...')

onMounted(async () => {
  const projects = await projectRepository.getAllProjects()
  projectCount.value = projects.length

  const estimate = await getStorageEstimate()
  if (estimate) {
    storageDisplay.value = formatBytes(estimate.usage)
  } else {
    storageDisplay.value = 'N/A'
  }
})
</script>

<style scoped>
.home-content {
  padding: 0 1.5rem 2rem;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.welcome-body {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.welcome-desc {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
}

.stats-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.stat-body {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  margin-top: 0.125rem;
}

@media (max-width: 640px) {
  .home-content {
    padding: 0 1rem 2rem;
  }

  .quick-actions {
    flex-direction: column;
  }
}
</style>
