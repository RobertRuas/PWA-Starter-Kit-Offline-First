<template>
  <ion-page>
    <PageHeader title="Ajustes" />
    <ion-content class="ion-padding">
      <div class="settings-container">
        <ion-list lines="inset">
          <ion-list-header>
            <ion-label>Aparência</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-select
              v-model="currentTheme"
              label="Tema"
              interface="popover"
              @ion-change="handleThemeChange"
            >
              <ion-select-option value="system">Sistema</ion-select-option>
              <ion-select-option value="light">Claro</ion-select-option>
              <ion-select-option value="dark">Escuro</ion-select-option>
            </ion-select>
          </ion-item>
        </ion-list>

        <ion-list lines="inset">
          <ion-list-header>
            <ion-label>Dados locais</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-label>
              <h3>Registros salvos</h3>
              <p>{{ recordCount }} registros no dispositivo</p>
            </ion-label>
          </ion-item>
          <ion-item button @click="handleExport">
            <ion-icon :icon="downloadOutline" slot="start" color="primary" />
            <ion-label>Exportar dados</ion-label>
          </ion-item>
          <ion-item button @click="triggerImport">
            <ion-icon :icon="pushOutline" slot="start" color="primary" />
            <ion-label>Importar dados</ion-label>
          </ion-item>
          <ion-item button @click="confirmClearData">
            <ion-icon :icon="trashOutline" slot="start" color="danger" />
            <ion-label color="danger">Apagar dados de demonstração</ion-label>
          </ion-item>
        </ion-list>

        <ion-list lines="inset">
          <ion-list-header>
            <ion-label>Sobre</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-label>
              <h3>{{ appConfig.name }}</h3>
              <p>{{ appConfig.description }}</p>
            </ion-label>
          </ion-item>
          <ion-item>
            <ion-label>
              <p>Versão 0.1.0</p>
            </ion-label>
          </ion-item>
        </ion-list>

        <div class="storage-notice">
          <p>
            Os dados são armazenados localmente neste dispositivo usando IndexedDB.
            O navegador ou o sistema operacional podem remover os dados em situações
            de pressão de armazenamento. Faça exportações regulares dos dados importantes.
          </p>
        </div>
      </div>

      <input
        ref="fileInput"
        type="file"
        accept=".json"
        style="display: none"
        @change="handleFileSelected"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IonPage,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
  alertController,
  toastController,
} from '@ionic/vue'
import { downloadOutline, pushOutline, trashOutline } from 'ionicons/icons'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { appConfig } from '../../../app/config/app.config'
import { usePreferencesStore } from '../../../stores/preferences'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import { exportAllData, downloadAsJson } from '../../../core/storage/export'
import { importData } from '../../../core/storage/import'

const preferencesStore = usePreferencesStore()
const recordCount = ref(0)
const fileInput = ref<HTMLInputElement>()
const currentTheme = ref(preferencesStore.theme)

function handleThemeChange(event: CustomEvent) {
  preferencesStore.setTheme(event.detail.value)
}

async function loadCounts() {
  recordCount.value = await exampleRecordRepository.count()
}

async function handleExport() {
  try {
    const data = await exportAllData()
    const filename = `pwa-starter-export-${new Date().toISOString().slice(0, 10)}.json`
    downloadAsJson(data, filename)
    const toast = await toastController.create({
      message: 'Dados exportados com sucesso.',
      duration: 2000,
      color: 'success',
    })
    await toast.present()
  } catch {
    const toast = await toastController.create({
      message: 'Falha ao exportar dados.',
      duration: 3000,
      color: 'danger',
    })
    await toast.present()
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
    const toast = await toastController.create({
      message: `Importação concluída: ${result.imported} importados, ${result.skipped} já existentes.`,
      duration: 3000,
      color: 'success',
    })
    await toast.present()
  } else {
    const toast = await toastController.create({
      message: result.errors[0] || 'Falha na importação.',
      duration: 4000,
      color: 'danger',
    })
    await toast.present()
  }
}

async function confirmClearData() {
  const alert = await alertController.create({
    header: 'Apagar dados',
    message:
      'Todos os registros de demonstração serão removidos permanentemente deste dispositivo. Esta ação não pode ser desfeita.',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Apagar',
        role: 'destructive',
        handler: async () => {
          await exampleRecordRepository.clear()
          await loadCounts()
          const toast = await toastController.create({
            message: 'Dados de demonstração removidos.',
            duration: 2000,
          })
          await toast.present()
        },
      },
    ],
  })
  await alert.present()
}

onMounted(loadCounts)
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
}

ion-list-header {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

ion-item h3 {
  font-size: var(--font-size-base) !important;
  font-weight: var(--font-weight-medium) !important;
}

ion-item p {
  font-size: var(--font-size-sm) !important;
}

.storage-notice {
  margin: var(--space-6) var(--space-4);
  padding: var(--space-3);
  background: var(--color-surface-variant);
  border-radius: var(--radius-md);
}

.storage-notice p {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: var(--line-height-normal);
}
</style>
