<template>
  <div>
    <PageHeader title="Registros">
      <template #actions>
        <Button icon="pi pi-plus" rounded text @click="router.push('/records/new')" />
      </template>
    </PageHeader>
    <div style="padding: 1rem;">
      <EmptyState
        v-if="!loading && records.length === 0"
        title="Nenhum registro"
        description="Toque no botao + para criar um registro de demonstracao."
        icon="pi pi-folder-open"
      >
        <Button
          label="Criar registro"
          outlined
          size="small"
          style="margin-top: 0.75rem;"
          @click="router.push('/records/new')"
        />
      </EmptyState>

      <DataView v-else :value="records" data-key="id">
        <template #list="slotProps">
          <div
            v-for="record in slotProps.items"
            :key="record.id"
            style="cursor: pointer; padding: 0.75rem 1rem; border-bottom: 1px solid var(--p-content-border-color);"
            @click="router.push(`/records/${record.id}`)"
          >
            <div style="font-weight: 500;">{{ record.title }}</div>
            <div v-if="record.description" style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ record.description }}</div>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;">
              <Tag
                :value="record.status === 'active' ? 'Ativo' : 'Arquivado'"
                :severity="record.status === 'active' ? 'success' : 'secondary'"
              />
              <span style="font-size: 0.75rem; color: var(--p-text-muted-color);">{{ formatDate(record.createdAt) }}</span>
              <Button
                icon="pi pi-trash"
                text
                rounded
                severity="danger"
                size="small"
                style="margin-left: auto;"
                @click.stop="confirmDelete(record)"
              />
            </div>
          </div>
        </template>
      </DataView>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DataView from 'primevue/dataview'
import PageHeader from '../../../components/ui/PageHeader.vue'
import EmptyState from '../../../components/feedback/EmptyState.vue'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import type { ExampleRecord } from '../../../core/database/db'

const router = useRouter()
const confirm = useConfirm()
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function confirmDelete(record: ExampleRecord) {
  confirm.require({
    message: `Tem certeza que deseja excluir "${record.title}"? Esta acao nao pode ser desfeita.`,
    header: 'Excluir registro',
    icon: 'pi pi-exclamation-triangle',
    rejectLabel: 'Cancelar',
    acceptLabel: 'Excluir',
    acceptClass: 'p-button-danger',
    accept: async () => {
      if (record.id) {
        await exampleRecordRepository.remove(record.id)
        await loadRecords()
      }
    },
  })
}

onMounted(loadRecords)
</script>
