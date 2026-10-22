<template>
  <div>
    <PageHeader title="Ajustes" />
    <div style="max-width: 600px; margin: 0 auto; padding: 1rem;">
      <Panel header="Aparencia" style="margin-bottom: 1rem;">
        <div class="p-fluid">
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
      </Panel>

      <Panel header="Dados locais" style="margin-bottom: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <div style="font-weight: 500;">Registros salvos</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ recordCount }} registros no dispositivo</div>
          </div>
          <Button label="Exportar dados" icon="pi pi-download" outlined @click="handleExport" />
          <Button label="Importar dados" icon="pi pi-upload" outlined @click="triggerImport" />
          <Button label="Apagar dados de demonstracao" icon="pi pi-trash" outlined severity="danger" @click="confirmClearData" />
        </div>
      </Panel>

      <Panel header="Armazenamento" style="margin-bottom: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <div style="font-weight: 500;">Espaco utilizado</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ storageUsage }}</div>
          </div>
          <div>
            <div style="font-weight: 500;">Persistencia</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ storagePersisted ? 'Dados protegidos contra limpeza automatica' : 'Dados podem ser removidos pelo navegador' }}</div>
          </div>
          <Button
            v-if="!storagePersisted"
            label="Solicitar persistencia"
            icon="pi pi-shield"
            outlined
            @click="handleRequestPersistence"
          />
        </div>
      </Panel>

      <Panel header="Diagnostico" style="margin-bottom: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div>
            <div style="font-weight: 500;">Versao da aplicacao</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">0.1.0</div>
          </div>
          <div>
            <div style="font-weight: 500;">Esquema do banco</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">Versao 1</div>
          </div>
          <div>
            <div style="font-weight: 500;">Estado da rede</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ isOnline ? 'Conectado' : 'Sem conexao' }}</div>
          </div>
          <div>
            <div style="font-weight: 500;">Operacoes pendentes</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ pendingOps }} na fila de sincronizacao</div>
          </div>
          <Button label="Copiar informacoes de diagnostico" icon="pi pi-copy" outlined @click="copyDiagnostics" />
        </div>
      </Panel>

      <Panel header="Sobre" style="margin-bottom: 1rem;">
        <div>
          <div style="font-weight: 500;">{{ appConfig.name }}</div>
          <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ appConfig.description }}</div>
        </div>
      </Panel>

      <Message severity="info" :closable="false" style="margin-top: 1rem;">
        Os dados sao armazenados localmente neste dispositivo usando IndexedDB.
        O navegador ou o sistema operacional podem remover os dados em situacoes
        de pressao de armazenamento. Faca exportacoes regulares dos dados importantes.
      </Message>

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
import Panel from 'primevue/panel'
import Select from 'primevue/select'
import Message from 'primevue/message'
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
    toast.add({ severity: 'success', summary: 'Informacoes copiadas para a area de transferencia.', life: 2000 })
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
      `Importacao concluida: ${result.imported} importados, ${result.skipped} ja existentes.`
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
