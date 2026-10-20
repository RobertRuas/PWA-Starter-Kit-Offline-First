<template>
  <ion-page>
    <PageHeader title="Registros">
      <template #actions>
        <ion-buttons slot="end">
          <ion-button router-link="/records/new">
            <ion-icon slot="icon-only" :icon="addOutline" />
          </ion-button>
        </ion-buttons>
      </template>
    </PageHeader>
    <ion-content>
      <ion-refresher slot="fixed" @ion-refresh="handleRefresh">
        <ion-refresher-content />
      </ion-refresher>

      <EmptyState
        v-if="!loading && records.length === 0"
        title="Nenhum registro"
        description="Toque no botão + para criar um registro de demonstração."
        :icon="folderOpenOutline"
      >
        <ion-button
          class="ion-margin-top"
          router-link="/records/new"
          fill="outline"
          size="small"
        >
          Criar registro
        </ion-button>
      </EmptyState>

      <ion-list v-else lines="inset">
        <ion-item-sliding v-for="record in records" :key="record.id">
          <ion-item
            :router-link="`/records/${record.id}`"
            detail
          >
            <ion-label>
              <h3>{{ record.title }}</h3>
              <p v-if="record.description">{{ record.description }}</p>
              <p class="record-meta">
                <ion-badge :color="record.status === 'active' ? 'success' : 'medium'">
                  {{ record.status === 'active' ? 'Ativo' : 'Arquivado' }}
                </ion-badge>
                <span>{{ formatDate(record.createdAt) }}</span>
              </p>
            </ion-label>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option color="danger" @click="confirmDelete(record)">
              <ion-icon slot="icon-only" :icon="trashOutline" />
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
  IonBadge,
  IonRefresher,
  IonRefresherContent,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  alertController,
} from '@ionic/vue'
import { addOutline, folderOpenOutline, trashOutline } from 'ionicons/icons'
import PageHeader from '../../../components/ui/PageHeader.vue'
import EmptyState from '../../../components/feedback/EmptyState.vue'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import type { ExampleRecord } from '../../../core/database/db'

const records = ref<ExampleRecord[]>([])
const loading = ref(true)

async function loadRecords() {
  loading.value = true
  try {
    records.value = await exampleRecordRepository.getAll()
  } finally {
    loading.value = false
  }
}

async function handleRefresh(event: CustomEvent) {
  await loadRecords()
  ;(event.target as HTMLIonRefresherElement).complete()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

async function confirmDelete(record: ExampleRecord) {
  const alert = await alertController.create({
    header: 'Excluir registro',
    message: `Tem certeza que deseja excluir "${record.title}"? Esta ação não pode ser desfeita.`,
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Excluir',
        role: 'destructive',
        handler: async () => {
          if (record.id) {
            await exampleRecordRepository.remove(record.id)
            await loadRecords()
          }
        },
      },
    ],
  })
  await alert.present()
}

onMounted(loadRecords)
</script>

<style scoped>
ion-item h3 {
  font-size: var(--font-size-base) !important;
  font-weight: var(--font-weight-medium) !important;
}

ion-item p {
  font-size: var(--font-size-sm) !important;
}

.record-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-1);
}

.record-meta ion-badge {
  font-size: var(--font-size-xs);
  padding: 2px 6px;
}

.record-meta span {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
</style>
