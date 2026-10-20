<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonIcon,
  IonToast,
  IonItemGroup,
  IonItemDivider,
} from '@ionic/vue';
import {
  downloadOutline,
  cloudUploadOutline,
  informationCircleOutline,
  copyOutline,
} from 'ionicons/icons';
import { appConfig } from '../config/app.config';
import { exportAllData, downloadExport } from '../../core/storage/export';
import { validateImportFile, importData } from '../../core/storage/import';
import { checkDatabaseHealth } from '../../core/database/migrations';
import { useConnectivity } from '../../core/network/connectivity';
import { useSyncStatus } from '../../core/sync/sync-status';
import { getRecordCount } from '../../features/example-records/services/example-record.service';

const { isOnline } = useConnectivity();
const { pendingCount } = useSyncStatus();

const recordCount = ref(0);
const dbHealth = ref({ isOpen: false, version: 0, tables: [] as string[] });
const toastMessage = ref('');
const showToast = ref(false);

async function loadDiagnostics() {
  recordCount.value = await getRecordCount();
  dbHealth.value = await checkDatabaseHealth();
}

async function handleExport() {
  try {
    const data = await exportAllData();
    downloadExport(data);
    toastMessage.value = 'Dados exportados com sucesso';
    showToast.value = true;
  } catch {
    toastMessage.value = 'Erro ao exportar dados';
    showToast.value = true;
  }
}

async function handleImport() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const exportData = await validateImportFile(file);
      const result = await importData(exportData, 'merge');
      toastMessage.value = `Importados: ${result.imported}, Duplicados: ${result.duplicated}, Rejeitados: ${result.rejected}`;
      showToast.value = true;
      await loadDiagnostics();
    } catch (e) {
      toastMessage.value = e instanceof Error ? e.message : 'Erro ao importar';
      showToast.value = true;
    }
  };
  input.click();
}

async function copyDiagnostics() {
  const info = [
    `App: ${appConfig.name} v${appConfig.version}`,
    `Banco: v${dbHealth.value.version}, ${dbHealth.value.isOpen ? 'aberto' : 'fechado'}`,
    `Tabelas: ${dbHealth.value.tables.join(', ')}`,
    `Registros: ${recordCount.value}`,
    `Conexão: ${isOnline.value ? 'online' : 'offline'}`,
    `Operações pendentes: ${pendingCount.value}`,
    `Data: ${new Date().toISOString()}`,
    `User-Agent: ${navigator.userAgent}`,
  ].join('\n');

  try {
    await navigator.clipboard.writeText(info);
    toastMessage.value = 'Diagnóstico copiado';
    showToast.value = true;
  } catch {
    toastMessage.value = 'Não foi possível copiar';
    showToast.value = true;
  }
}

onMounted(loadDiagnostics);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Configurações</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonList>
        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Dados</IonLabel>
          </IonItemDivider>
          <IonItem button @click="handleExport">
            <template #start>
              <IonIcon :icon="downloadOutline" />
            </template>
            <IonLabel>Exportar dados</IonLabel>
            <template #end>
              <IonNote>JSON</IonNote>
            </template>
          </IonItem>
          <IonItem button @click="handleImport">
            <template #start>
              <IonIcon :icon="cloudUploadOutline" />
            </template>
            <IonLabel>Importar dados</IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Armazenamento</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonLabel>
              <h3>Aviso importante</h3>
              <p>
                Os dados são salvos no navegador deste dispositivo. O sistema pode remover dados em
                caso de pouco espaço. Faça backup regularmente usando a exportação acima.
              </p>
            </IonLabel>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonItemDivider>
            <IonLabel>Diagnóstico</IonLabel>
          </IonItemDivider>
          <IonItem>
            <template #start>
              <IonIcon :icon="informationCircleOutline" />
            </template>
            <IonLabel>
              <h3>{{ appConfig.name }}</h3>
              <p>Versão {{ appConfig.version }}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <p>Banco: v{{ dbHealth.version }} · {{ recordCount }} registro(s)</p>
              <p>Conexão: {{ isOnline ? 'Online' : 'Offline' }}</p>
              <p>Pendências de sync: {{ pendingCount }}</p>
            </IonLabel>
          </IonItem>
          <IonItem button @click="copyDiagnostics">
            <template #start>
              <IonIcon :icon="copyOutline" />
            </template>
            <IonLabel>Copiar informações de diagnóstico</IonLabel>
          </IonItem>
        </IonItemGroup>
      </IonList>

      <IonToast
        :is-open="showToast"
        :message="toastMessage"
        :duration="3000"
        position="bottom"
        @did-dismiss="showToast = false"
      />
    </IonContent>
  </IonPage>
</template>
