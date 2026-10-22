<template>
  <div>
    <PageHeader title="Inicio" subtitle="Bem-vindo ao PWA Starter Kit" />

    <div class="home-content">
      <!-- Stats cards -->
      <div class="stats-grid">
        <Card class="stat-card">
          <template #content>
            <div class="stat-card-body">
              <div>
                <div class="stat-value">{{ recordCount }}</div>
                <div class="stat-label">Registros</div>
              </div>
              <i class="pi pi-database stat-icon" />
            </div>
          </template>
        </Card>
        <Card class="stat-card">
          <template #content>
            <div class="stat-card-body">
              <div>
                <div class="stat-value">{{ pendingOps }}</div>
                <div class="stat-label">Pendentes</div>
              </div>
              <i class="pi pi-sync stat-icon" />
            </div>
          </template>
        </Card>
        <Card class="stat-card">
          <template #content>
            <div class="stat-card-body">
              <div>
                <div class="stat-value">{{ storageDisplay }}</div>
                <div class="stat-label">Armazenamento</div>
              </div>
              <i class="pi pi-server stat-icon" />
            </div>
          </template>
        </Card>
      </div>

      <!-- Quick actions -->
      <Card>
        <template #title>Acoes rapidas</template>
        <template #content>
          <div class="quick-actions">
            <Button
              label="Novo registro"
              icon="pi pi-plus"
              @click="router.push('/records/new')"
            />
            <Button
              label="Ver registros"
              icon="pi pi-database"
              outlined
              @click="router.push('/records')"
            />
            <Button
              label="Vitrine de componentes"
              icon="pi pi-palette"
              outlined
              @click="router.push('/showcase')"
            />
          </div>
        </template>
      </Card>

      <!-- Features -->
      <Card>
        <template #title>Funcionalidades</template>
        <template #content>
          <div class="features-list">
            <div v-for="item in features" :key="item.title" class="feature-item">
              <div class="feature-icon-wrapper">
                <i :class="item.icon" class="feature-icon" />
              </div>
              <div>
                <div class="feature-title">{{ item.title }}</div>
                <div class="feature-desc">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <!-- Example pages -->
      <Card>
        <template #title>Paginas de exemplo</template>
        <template #subtitle>Explore os exemplos para ver o que o kit oferece</template>
        <template #content>
          <div class="example-links">
            <Button
              label="Dashboard financeiro"
              icon="pi pi-chart-bar"
              outlined
              @click="router.push('/examples/dashboard')"
            />
            <Button
              label="Gestao de contactos"
              icon="pi pi-users"
              outlined
              @click="router.push('/examples/contacts')"
            />
            <Button
              label="Login"
              icon="pi pi-sign-in"
              outlined
              @click="router.push('/examples/login')"
            />
            <Button
              label="Cadastro"
              icon="pi pi-user-plus"
              outlined
              @click="router.push('/examples/signup')"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import { syncQueue } from '../../../core/sync/queue'
import { getStorageEstimate, formatBytes } from '../../../core/storage/storage-manager'

const router = useRouter()
const recordCount = ref(0)
const pendingOps = ref(0)
const storageDisplay = ref('...')

const features = [
  { icon: 'pi pi-mobile', title: 'Mobile-first', description: 'Interface otimizada para telas pequenas' },
  { icon: 'pi pi-cloud', title: 'Offline-first', description: 'Funciona sem internet apos o primeiro carregamento' },
  { icon: 'pi pi-database', title: 'Dados locais', description: 'IndexedDB com Dexie.js para persistencia estruturada' },
  { icon: 'pi pi-download', title: 'Exportacao e importacao', description: 'Backup e recuperacao dos dados do dispositivo' },
]

onMounted(async () => {
  recordCount.value = await exampleRecordRepository.count()
  pendingOps.value = await syncQueue.pendingCount()
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
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.stat-card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  margin-top: 0.125rem;
}

.stat-icon {
  font-size: 2rem;
  color: var(--p-primary-color);
  opacity: 0.5;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.feature-icon-wrapper {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--p-border-radius);
  background: var(--p-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon {
  font-size: 1.1rem;
  color: var(--p-primary-color);
}

.feature-title {
  font-weight: 600;
}

.feature-desc {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.example-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (max-width: 640px) {
  .home-content {
    padding: 0 1rem 2rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
