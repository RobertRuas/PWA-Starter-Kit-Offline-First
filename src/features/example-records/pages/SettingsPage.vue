<template>
  <div>
    <PageHeader title="Ajustes" />

    <div class="settings-content">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Geral</Tab>
          <Tab value="1">Dados</Tab>
          <Tab value="2">Diagnostico</Tab>
        </TabList>

        <TabPanels>
          <!-- General tab -->
          <TabPanel value="0">
            <Card>
              <template #title>Aparencia</template>
              <template #content>
                <div class="p-fluid setting-field">
                  <label for="theme-select">Tema</label>
                  <Select
                    id="theme-select"
                    v-model="currentTheme"
                    :options="themeOptions"
                    option-label="label"
                    option-value="value"
                    @change="handleThemeChange"
                  />
                </div>
              </template>
            </Card>

            <Card style="margin-top: 1rem;">
              <template #title>Sobre</template>
              <template #content>
                <div class="about-info">
                  <div class="about-name">{{ appConfig.name }}</div>
                  <div class="about-desc">{{ appConfig.description }}</div>
                  <div class="about-version">Versao 0.1.0</div>
                </div>
              </template>
            </Card>
          </TabPanel>

          <!-- Data tab -->
          <TabPanel value="1">
            <Card>
              <template #title>Dados locais</template>
              <template #content>
                <div class="data-section">
                  <div class="data-info">
                    <i class="pi pi-database data-info-icon" />
                    <div>
                      <div class="data-info-label">Registros salvos</div>
                      <div class="data-info-value">{{ recordCount }} registros no dispositivo</div>
                    </div>
                  </div>

                  <div class="data-actions">
                    <Button label="Exportar dados" icon="pi pi-download" outlined @click="handleExport" />
                    <Button label="Importar dados" icon="pi pi-upload" outlined @click="triggerImport" />
                    <Button label="Apagar dados de demonstracao" icon="pi pi-trash" outlined severity="danger" @click="confirmClearData" />
                  </div>
                </div>
              </template>
            </Card>

            <Card style="margin-top: 1rem;">
              <template #title>Armazenamento</template>
              <template #content>
                <div class="data-section">
                  <div class="data-info">
                    <i class="pi pi-server data-info-icon" />
                    <div>
                      <div class="data-info-label">Espaco utilizado</div>
                      <div class="data-info-value">{{ storageUsage }}</div>
                    </div>
                  </div>
                  <div class="data-info">
                    <i class="pi pi-shield data-info-icon" />
                    <div>
                      <div class="data-info-label">Persistencia</div>
                      <div class="data-info-value">{{ storagePersisted ? 'Dados protegidos contra limpeza automatica' : 'Dados podem ser removidos pelo navegador' }}</div>
                    </div>
                  </div>
                  <Button
                    v-if="!storagePersisted"
                    label="Solicitar persistencia"
                    icon="pi pi-shield"
                    outlined
                  @click="handleRequestPersistence"
                  />
                </div>
              </template>
            </Card>

            <Message severity="info" :closable="false" style="margin-top: 1rem;">
              Os dados sao armazenados localmente neste dispositivo usando IndexedDB.
              O navegador ou o sistema operacional podem remover os dados em situacoes
              de pressao de armazenamento. Faca exportacoes regulares dos dados importantes.
            </Message>
          </TabPanel>

          <!-- Diagnostics tab -->
          <TabPanel value="2">
            <Card>
              <template #title>Informacoes do sistema</template>
              <template #content>
                <div class="diag-list">
                  <div class="diag-item">
                    <div class="diag-label">Versao da aplicacao</div>
                    <div class="diag-value">0.1.0</div>
                  </div>
                  <div class="diag-item">
                    <div class="diag-label">Esquema do banco</div>
                    <div class="diag-value">Versao 1</div>
                  </div>
                  <div class="diag-item">
                    <div class="diag-label">Estado da rede</div>
                    <Tag
                      :value="isOnline ? 'Conectado' : 'Sem conexao'"
                      :severity="isOnline ? 'success' : 'secondary'"
                      rounded
                    />
                  </div>
                  <div class="diag-item">
                    <div class="diag-label">Operacoes pendentes</div>
                    <div class="diag-value">{{ pendingOps }} na fila de sincronizacao</div>
                  </div>
                </div>
                <Button
                  label="Copiar informacoes de diagnostico"
                  icon="pi pi-copy"
                  outlined
                  style="margin-top: 1rem;"
                  @click="copyDiagnostics"
                />
              </template>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>

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
import Select from 'primevue/select'
import Message from 'primevue/message'
import Tag from 'primevue/tag'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { appConfig } from '../../../app/config/app.config'
import { usePreferencesStore } from '../../../stores/preferences'
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
const preferencesStore = usePreferencesStore()
const { isOnline } = useConnectivity()
const { showError, showSuccess } = useErrorToast()
const recordCount = ref(0)
const pendingOps = ref(0)
const storageUsage = ref('Calculando...')
const storagePersisted = ref(false)
const fileInput = ref<HTMLInputElement>()
const currentTheme = ref(preferencesStore.theme)

const themeOptions = [
  { label: 'Sistema', value: 'system' },
  { label: 'Claro', value: 'light' },
  { label: 'Escuro', value: 'dark' },
]

function handleThemeChange() {
  preferencesStore.setTheme(currentTheme.value)
}

async function loadCounts() {
  recordCount.value = await exampleRecordRepository.count()
  pendingOps.value = await syncQueue.pendingCount()
}

async function loadStorageInfo() {
  const estimate = await getStorageEstimate()
  if (estimate) {
    storageUsage.value = `${formatBytes(estimate.usage)} de ${formatBytes(estimate.quota)} (${estimate.percentUsed.toFixed(1)}%)`
    storagePersisted.value = estimate.persisted
  } else {
    storageUsage.value = 'Informacao nao disponivel'
  }
}

async function handleRequestPersistence() {
  const granted = await requestPersistentStorage()
  storagePersisted.value = granted
  toast.add({
    severity: granted ? 'success' : 'warn',
    summary: granted
      ? 'Persistencia concedida. Seus dados estao protegidos.'
      : 'O navegador nao concedeu persistencia neste momento.',
    life: 3000,
  })
}

async function copyDiagnostics() {
  const estimate = await getStorageEstimate()
  const info = [
    `Aplicacao: ${appConfig.name} v0.1.0`,
    `Esquema do banco: v1`,
    `Rede: ${isOnline.value ? 'online' : 'offline'}`,
    `Registros: ${recordCount.value}`,
    `Operacoes pendentes: ${pendingOps.value}`,
    `Armazenamento: ${estimate ? formatBytes(estimate.usage) + ' de ' + formatBytes(estimate.quota) : 'N/A'}`,
    `Persistencia: ${estimate?.persisted ? 'sim' : 'nao'}`,
    `User-Agent: ${navigator.userAgent}`,
    `Data: ${new Date().toISOString()}`,
  ].join('\n')

  try {
    await navigator.clipboard.writeText(info)
    toast.add({ severity: 'success', summary: 'Informacoes copiadas.', life: 2000 })
  } catch {
    showError('Nao foi possivel copiar. Tente novamente.', 2000)
  }
}

async function handleExport() {
  try {
    const data = await exportAllData()
    const filename = `pwa-starter-export-${new Date().toISOString().slice(0, 10)}.json`
    downloadAsJson(data, filename)
    showSuccess('Dados exportados com sucesso.')
  } catch {
    showError('Falha ao exportar dados.')
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
    showSuccess(
      `Importacao concluida: ${result.imported} importados, ${result.skipped} ja existentes.`,
    )
  } else {
    showError(result.errors[0] || 'Falha na importacao.')
  }
}

function confirmClearData() {
  confirm.require({
    message:
      'Todos os registros de demonstracao serao removidos permanentemente deste dispositivo. Esta acao nao pode ser desfeita.',
    header: 'Apagar dados',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Apagar',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await exampleRecordRepository.clear()
      await loadCounts()
      showSuccess('Dados de demonstracao removidos.', 2000)
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
  max-width: 700px;
  margin: 0 auto;
}

.setting-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.setting-field label {
  font-weight: 600;
  font-size: 0.875rem;
}

.about-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.about-name {
  font-weight: 700;
  font-size: 1.1rem;
}

.about-desc {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.about-version {
  color: var(--p-text-muted-color);
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.data-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-info {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.data-info-icon {
  font-size: 1.25rem;
  color: var(--p-primary-color);
  margin-top: 0.125rem;
}

.data-info-label {
  font-weight: 600;
  font-size: 0.875rem;
}

.data-info-value {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.diag-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.diag-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--p-surface-200);
}

.diag-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.diag-label {
  font-weight: 600;
  font-size: 0.875rem;
}

.diag-value {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .settings-content {
    padding: 0 1rem 2rem;
  }
}
</style>
