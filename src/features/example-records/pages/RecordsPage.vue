<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonFab,
  IonFabButton,
  IonIcon,
  IonSearchbar,
  IonModal,
  IonRefresher,
  IonRefresherContent,
  IonToast,
} from '@ionic/vue';
import { addOutline, documentTextOutline } from 'ionicons/icons';
import RecordCard from '../components/RecordCard.vue';
import RecordForm from '../components/RecordForm.vue';
import EmptyState from '../../../components/ui/EmptyState.vue';
import ErrorState from '../../../components/ui/ErrorState.vue';
import ConfirmDialog from '../../../components/ui/ConfirmDialog.vue';
import ConnectionStatus from '../../../components/feedback/ConnectionStatus.vue';
import LocalSaveStatus from '../../../components/feedback/LocalSaveStatus.vue';
import type { ExampleRecord } from '../types/example-record';
import {
  getAllRecords,
  searchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecord,
} from '../services/example-record.service';

const records = ref<ExampleRecord[]>([]);
const searchQuery = ref('');
const isLoading = ref(true);
const error = ref<string | null>(null);
const lastSavedAt = ref<string | undefined>();

const isFormOpen = ref(false);
const editingRecord = ref<ExampleRecord | undefined>();
const isDeleteConfirmOpen = ref(false);
const deletingId = ref<string | null>(null);
const toastMessage = ref('');
const showToast = ref(false);

async function loadRecords() {
  isLoading.value = true;
  error.value = null;
  try {
    records.value = searchQuery.value
      ? await searchRecords(searchQuery.value)
      : await getAllRecords();
  } catch (e) {
    error.value = 'Não foi possível carregar os registros.';
  } finally {
    isLoading.value = false;
  }
}

function openNewForm() {
  editingRecord.value = undefined;
  isFormOpen.value = true;
}

async function openEditForm(id: string) {
  const record = await getRecord(id);
  if (record) {
    editingRecord.value = record;
    isFormOpen.value = true;
  }
}

async function handleSave(data: { title: string; description: string }) {
  try {
    if (editingRecord.value) {
      await updateRecord(editingRecord.value.id, data);
      toastMessage.value = 'Registro atualizado com sucesso';
    } else {
      await createRecord(data);
      toastMessage.value = 'Registro criado com sucesso';
    }
    lastSavedAt.value = new Date().toISOString();
    showToast.value = true;
    isFormOpen.value = false;
    await loadRecords();
  } catch (e) {
    toastMessage.value = e instanceof Error ? e.message : 'Erro ao salvar registro';
    showToast.value = true;
  }
}

function confirmDelete(id: string) {
  deletingId.value = id;
  isDeleteConfirmOpen.value = true;
}

async function handleDelete() {
  if (!deletingId.value) return;
  try {
    await deleteRecord(deletingId.value);
    toastMessage.value = 'Registro excluído';
    showToast.value = true;
    await loadRecords();
  } catch (e) {
    toastMessage.value = e instanceof Error ? e.message : 'Erro ao excluir registro';
    showToast.value = true;
  } finally {
    isDeleteConfirmOpen.value = false;
    deletingId.value = null;
  }
}

async function handleRefresh(event: CustomEvent) {
  await loadRecords();
  (event.target as HTMLIonRefresherElement).complete();
}

async function handleSearch(event: CustomEvent) {
  searchQuery.value = event.detail.value ?? '';
  await loadRecords();
}

onMounted(loadRecords);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Registros</IonTitle>
        <template #end>
          <ConnectionStatus />
        </template>
      </IonToolbar>
      <IonToolbar>
        <IonSearchbar
          :value="searchQuery"
          placeholder="Buscar registros..."
          :debounce="300"
          aria-label="Buscar registros"
          @ion-input="handleSearch"
        />
      </IonToolbar>
    </IonHeader>

    <IonContent>
      <IonRefresher slot="fixed" @ion-refresh="handleRefresh">
        <IonRefresherContent />
      </IonRefresher>

      <LocalSaveStatus :saved-at="lastSavedAt" />

      <ErrorState
        v-if="error"
        :message="error"
        retry-label="Tentar novamente"
        @retry="loadRecords"
      />

      <EmptyState
        v-else-if="!isLoading && records.length === 0"
        :icon="documentTextOutline"
        title="Nenhum registro"
        description="Crie seu primeiro registro tocando no botão abaixo."
        action-label="Criar registro"
        @action="openNewForm"
      />

      <IonList v-else>
        <RecordCard
          v-for="record in records"
          :key="record.id"
          :record="record"
          @edit="openEditForm"
          @delete="confirmDelete"
        />
      </IonList>

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton aria-label="Criar novo registro" @click="openNewForm">
          <IonIcon :icon="addOutline" />
        </IonFabButton>
      </IonFab>

      <IonModal :is-open="isFormOpen" @did-dismiss="isFormOpen = false">
        <RecordForm :record="editingRecord" @save="handleSave" @cancel="isFormOpen = false" />
      </IonModal>

      <ConfirmDialog
        :is-open="isDeleteConfirmOpen"
        header="Excluir registro"
        message="Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
        confirm-label="Excluir"
        :destructive="true"
        @confirm="handleDelete"
        @cancel="isDeleteConfirmOpen = false"
      />

      <IonToast
        :is-open="showToast"
        :message="toastMessage"
        :duration="2000"
        position="bottom"
        @did-dismiss="showToast = false"
      />
    </IonContent>
  </IonPage>
</template>
