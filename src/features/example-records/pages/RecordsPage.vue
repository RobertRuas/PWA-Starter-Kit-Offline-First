<template>
  <div>
    <PageHeader title="Registros" subtitle="Gerenciar registros locais">
      <template #actions>
        <Button
          icon="pi pi-plus"
          label="Novo"
          size="small"
          @click="router.push('/records/new')"
        />
      </template>
    </PageHeader>

    <div class="records-content">
      <!-- Search and filter bar -->
      <div class="records-toolbar">
        <IconField class="records-search">
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Buscar registros..." />
        </IconField>
        <SelectButton
          v-model="statusFilter"
          :options="filterOptions"
          option-label="label"
          option-value="value"
          class="records-filter"
        />
      </div>

      <EmptyState
        v-if="!loading && filteredRecords.length === 0"
        title="Nenhum registro"
        :description="searchQuery || statusFilter !== 'all' ? 'Nenhum resultado para os filtros selecionados.' : 'Crie um novo registro para comecar.'"
        icon="pi pi-folder-open"
      >
        <Button
          v-if="!searchQuery && statusFilter === 'all'"
          label="Criar registro"
          icon="pi pi-plus"
          outlined
          size="small"
          style="margin-top: 0.75rem;"
          @click="router.push('/records/new')"
        />
      </EmptyState>

      <DataTable
        v-if="filteredRecords.length > 0"
        :value="filteredRecords"
        data-key="id"
        striped-rows
        responsive-layout="scroll"
        :rows="20"
        :paginator="filteredRecords.length > 20"
        selection-mode="single"
        @row-select="onRowSelect"
      >
        <Column field="title" header="Titulo" sortable>
          <template #body="{ data }">
            <div class="record-title-cell">
              <div class="record-title">{{ data.title }}</div>
              <div v-if="data.description" class="record-desc">{{ data.description }}</div>
            </div>
          </template>
        </Column>
        <Column field="status" header="Estado" sortable style="width: 120px;">
          <template #body="{ data }">
            <Tag
              :value="data.status === 'active' ? 'Ativo' : 'Arquivado'"
              :severity="data.status === 'active' ? 'success' : 'secondary'"
              rounded
            />
          </template>
        </Column>
        <Column field="createdAt" header="Data" sortable style="width: 120px;">
          <template #body="{ data }">
            <span class="record-date">{{ formatDate(data.createdAt) }}</span>
          </template>
        </Column>
        <Column style="width: 60px;">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash"
              text
              rounded
              severity="danger"
              size="small"
              @click.stop="confirmDelete(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConfirm } from 'primevue/useconfirm'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import type { DataTableRowSelectEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import SelectButton from 'primevue/selectbutton'
import PageHeader from '../../../components/ui/PageHeader.vue'
import EmptyState from '../../../components/feedback/EmptyState.vue'
import { exampleRecordRepository } from '../../../core/database/repositories/example-record.repository'
import type { ExampleRecord } from '../../../core/database/db'

const router = useRouter()
const confirm = useConfirm()
const records = ref<ExampleRecord[]>([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')

const filterOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativos', value: 'active' },
  { label: 'Arquivados', value: 'archived' },
]

const filteredRecords = computed(() => {
  let result = records.value
  if (statusFilter.value !== 'all') {
    result = result.filter((r) => r.status === statusFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    )
  }
  return result
})

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

function onRowSelect(event: DataTableRowSelectEvent) {
  router.push(`/records/${event.data.id}`)
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

<style scoped>
.records-content {
  padding: 0 1.5rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.records-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.records-search {
  flex: 1;
  min-width: 200px;
}

.record-title-cell {
  padding: 0.25rem 0;
}

.record-title {
  font-weight: 600;
}

.record-desc {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
  margin-top: 0.125rem;
}

.record-date {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

@media (max-width: 640px) {
  .records-content {
    padding: 0 1rem 2rem;
  }

  .records-filter {
    width: 100%;
  }
}
</style>
