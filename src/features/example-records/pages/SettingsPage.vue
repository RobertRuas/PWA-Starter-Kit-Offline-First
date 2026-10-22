<template>
  <div>
    <PageHeader title="Ajustes" />

    <div class="settings-content">
      <!-- About -->
      <Card>
        <template #title>Sobre</template>
        <template #content>
          <div class="about-row">
            <span class="about-name">{{ appConfig.name }}</span>
            <span class="about-version">v0.1.0</span>
          </div>
          <div class="about-desc">{{ appConfig.description }}</div>
        </template>
      </Card>

      <!-- Local data -->
      <Card>
        <template #title>Dados locais</template>
        <template #content>
          <div class="data-section">
            <div class="data-info">
              <i class="pi pi-database data-info-icon" />
              <div>
                <span class="data-info-label">Registros salvos</span>
                <span class="data-info-value">{{ recordCount }}</span>
              </div>
            </div>

            <div class="data-actions">
              <Button label="Exportar dados" icon="pi pi-download" outlined size="small" @click="handleExport" />
              <Button label="Importar dados" icon="pi pi-upload" outlined size="small" @click="triggerImport" />
              <Button label="Apagar dados" icon="pi pi-trash" outlined severity="danger" size="small" @click="confirmClearData" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Storage -->
      <Card>
        <template #title>Armazenamento</template>
        <template #content>
          <div class="storage-compact">
            <div class="storage-row">
              <span class="storage-label">Espaco usado</span>
              <span class="storage-value">{{ storageUsage }}</span>
            </div>
            <div class="storage-row">
              <span class="storage-label">Persistencia</span>
              <Tag
                :value="storagePersisted ? 'Protegido' : 'Nao protegido'"
                :severity="storagePersisted ? 'success' : 'warn'"
                rounded
              />
            </div>
            <Button
              v-if="!storagePersisted"
              label="Solicitar persistencia"
              icon="pi pi-shield"
              outlined
              size="small"
              @click="handleRequestPersistence"
            />
          </div>
        </template>
      </Card>

      <!-- Diagnostics -->
      <Card>
        <template #title>Diagnostico</template>
        <template #content>
          <div class="diag-compact">
            <div class="diag-row">
              <span class="diag-label">Rede</span>
              <Tag
                :value="isOnline ? 'Online' : 'Offline'"
                :severity="isOnline ? 'success' : 'secondary'"
                rounded
              />
            </div>
            <div class="diag-row">
              <span class="diag-label">Sincronizacao</span>
              <span class="diag-value">{{ pendingOps }} pendentes</span>
            </div>
            <Button
              label="Copiar diagnostico"
              icon="pi pi-copy"
              outlined
              size="small"
              @click="copyDiagnostics"
            />
          </div>
        </template>
      </Card>

      <input
        ref="fileInput"
        type="file"
        accept=".json"
        style="display: none"
        @change="handleFileSelected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { appConfig } from '../../../app/config/app.config'
import { useConnectivity } from '../../../core/network/connectivity'
import { useErrorToast } from '../../../composables/useErrorToast'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import { exportAllData, downloadAsJson } from '../../../core/storage/export'
import { importData } from '../../../core/storage/import'
import { syncQueue } from '../../../core/sync/queue'
import {
  getStorageEstimate,
  requestPersistentStorage,
  formatBytes,
} from '../../../core/storage/storage-manager'

const toast = useToast()
const confirm = useConfirm()
const { isOnline } = useConnectivity()
const { showError, showSuccess } = useErrorToast()
const recordCount = ref(0)
const pendingOps = ref(0)
const storageUsage = ref('...')
const storagePersisted = ref(false)
const fileInput = ref<HTMLInputElement>()

async function loadCounts() {
  recordCount.value = await exampleRecordRepository.count()
  pendingOps.value = await syncQueue.pendingCount()
}

async function loadStorageInfo() {
  const estimate = await getStorageEstimate()
  if (estimate) {
    storageUsage.value = `${formatBytes(estimate.usage)} / ${formatBytes(estimate.quota)} (${estimate.percentUsed.toFixed(1)}%)`
    storagePersisted.value = estimate.persisted
  } else {
    storageUsage.value = 'N/A'
  }
}

async function handleRequestPersistence() {
  const granted = await requestPersistentStorage()
  storagePersisted.value = granted
  toast.add({
    severity: granted ? 'success' : 'warn',
    summary: granted
      ? 'Persistencia concedida.'
      : 'Navegador nao concedeu persistencia.',
    life: 3000,
  })
}

async function copyDiagnostics() {
  const estimate = await getStorageEstimate()
  const info = [
    `Aplicacao: ${appConfig.name} v0.1.0`,
    `Rede: ${isOnline.value ? 'online' : 'offline'}`,
    `Registros: ${recordCount.value}`,
    `Pendentes: ${pendingOps.value}`,
    `Armazenamento: ${estimate ? formatBytes(estimate.usage) + ' / ' + formatBytes(estimate.quota) : 'N/A'}`,
    `Persistencia: ${estimate?.persisted ? 'sim' : 'nao'}`,
    `UA: ${navigator.userAgent}`,
    `Data: ${new Date().toISOString()}`,
  ].join('\n')

  try {
    await navigator.clipboard.writeText(info)
    toast.add({ severity: 'success', summary: 'Copiado.', life: 2000 })
  } catch {
    showError('Nao foi possivel copiar.', 2000)
  }
}

async function handleExport() {
  try {
    const data = await exportAllData()
    const filename = `pwa-export-${new Date().toISOString().slice(0, 10)}.json`
    downloadAsJson(data, filename)
    showSuccess('Dados exportados.')
  } catch {
    showError('Falha ao exportar.')
  }
}

function triggerImport() {
  fileInput.value?.click()
}

async function handleFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const text = await file.text()
  const result = await importData(text)
  input.value = ''

  if (result.success) {
    await loadCounts()
    showSuccess(`${result.imported} importados, ${result.skipped} existentes.`)
  } else {
    showError(result.errors[0] || 'Falha na importacao.')
  }
}

function confirmClearData() {
  confirm.require({
    message: 'Todos os registros serao removidos permanentemente. Esta acao nao pode ser desfeita.',
    header: 'Apagar dados',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Apagar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await exampleRecordRepository.clear()
      await loadCounts()
      showSuccess('Dados removidos.', 2000)
    },
  })
}

onMounted(() => {
  loadCounts()
  loadStorageInfo()
})
</script>

<style scoped>
.settings-content {
  padding: 0 1.5rem 2rem;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.about-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.about-name {
  font-weight: 700;
  font-size: 1rem;
}

.about-version {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
}

.about-desc {
  color: var(--p-text-muted-color);
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.data-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.data-info-icon {
  font-size: 1rem;
  color: var(--p-primary-color);
}

.data-info-label {
  font-weight: 600;
  font-size: 0.8125rem;
}

.data-info-value {
  color: var(--p-text-muted-color);
  font-size: 0.8125rem;
  margin-left: 0.25rem;
}

.data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.storage-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.storage-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.storage-label {
  font-weight: 600;
  font-size: 0.8125rem;
}

.storage-value {
  color: var(--p-text-muted-color);
  font-size: 0.8125rem;
}

.diag-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.diag-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.diag-label {
  font-weight: 600;
  font-size: 0.8125rem;
}

.diag-value {
  color: var(--p-text-muted-color);
  font-size: 0.8125rem;
}

@media (max-width: 640px) {
  .settings-content {
    padding: 0 1rem 2rem;
  }
}
</style>
