<template>
  <div>
    <Toolbar>
      <template #start>
        <Button icon="pi pi-arrow-left" text rounded @click="router.push('/home')" />
        <span style="font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">Tabela de Produtos</span>
      </template>
    </Toolbar>

    <div style="padding: 1rem;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
        <IconField style="flex: 1; min-width: 200px;">
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchQuery" placeholder="Buscar produto..." />
        </IconField>
        <Select
          v-model="categoryFilter"
          :options="categories"
          option-label="label"
          option-value="value"
          placeholder="Categoria"
          style="min-width: 160px;"
        />
        <span style="color: var(--p-text-muted-color); font-size: 0.875rem;">
          {{ filteredProducts.length }} produto{{ filteredProducts.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <DataTable
        :value="filteredProducts"
        :sort-field="sortField"
        :sort-order="sortAsc ? 1 : -1"
        responsive-layout="scroll"
        striped-rows
        @sort="onSort"
      >
        <Column field="name" header="Produto" sortable />
        <Column field="category" header="Categoria" sortable :class="'hide-mobile'" />
        <Column field="price" header="Preco" sortable>
          <template #body="{ data }">
            {{ formatCurrency(data.price) }}
          </template>
        </Column>
        <Column field="stock" header="Estoque" sortable :class="'hide-mobile'" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <Tag :value="data.status" :severity="statusSeverity(data.status)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import Select from 'primevue/select'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import type { DataTableSortEvent } from 'primevue/datatable'

const router = useRouter()

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  status: 'Disponivel' | 'Baixo Estoque' | 'Esgotado'
}

const products: Product[] = [
  { id: 1, name: 'Notebook Pro 15"', category: 'Eletronicos', price: 4599.9, stock: 23, status: 'Disponivel' },
  { id: 2, name: 'Mouse Sem Fio', category: 'Perifericos', price: 89.9, stock: 150, status: 'Disponivel' },
  { id: 3, name: 'Teclado Mecanico RGB', category: 'Perifericos', price: 349.9, stock: 5, status: 'Baixo Estoque' },
  { id: 4, name: 'Monitor 27" 4K', category: 'Eletronicos', price: 2199.0, stock: 0, status: 'Esgotado' },
  { id: 5, name: 'Webcam Full HD', category: 'Perifericos', price: 199.9, stock: 42, status: 'Disponivel' },
  { id: 6, name: 'Headset Gamer 7.1', category: 'Audio', price: 279.9, stock: 3, status: 'Baixo Estoque' },
  { id: 7, name: 'Caixa de Som Bluetooth', category: 'Audio', price: 159.9, stock: 67, status: 'Disponivel' },
  { id: 8, name: 'SSD 1TB NVMe', category: 'Armazenamento', price: 499.9, stock: 0, status: 'Esgotado' },
  { id: 9, name: 'Hub USB-C 7 em 1', category: 'Perifericos', price: 189.9, stock: 28, status: 'Disponivel' },
  { id: 10, name: 'Cadeira Ergonomica', category: 'Mobiliario', price: 1299.0, stock: 8, status: 'Disponivel' },
  { id: 11, name: 'Suporte p/ Notebook', category: 'Mobiliario', price: 129.9, stock: 45, status: 'Disponivel' },
  { id: 12, name: 'Memoria RAM 16GB', category: 'Armazenamento', price: 329.9, stock: 2, status: 'Baixo Estoque' },
]

const searchQuery = ref('')
const categoryFilter = ref('all')
const sortField = ref('name')
const sortAsc = ref(true)

const categories = [
  { label: 'Todas', value: 'all' },
  ...Array.from(new Set(products.map((p) => p.category))).map((c) => ({ label: c, value: c })),
]

const filteredProducts = computed(() => {
  let result = [...products]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }
  if (categoryFilter.value !== 'all') {
    result = result.filter((p) => p.category === categoryFilter.value)
  }
  return result
})

function onSort(event: DataTableSortEvent) {
  sortField.value = String(event.sortField ?? 'name')
  sortAsc.value = event.sortOrder === 1
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function statusSeverity(status: string): string {
  if (status === 'Disponivel') return 'success'
  if (status === 'Baixo Estoque') return 'warn'
  return 'danger'
}
</script>

<style scoped>
@media (max-width: 640px) {
  :deep(.hide-mobile) {
    display: none;
  }
}
</style>
