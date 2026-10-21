<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButtons,
  IonBackButton,
  IonChip,
  IonLabel,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Disponível' | 'Baixo Estoque' | 'Esgotado';
}

const products: Product[] = [
  { id: 1, name: 'Notebook Pro 15"', category: 'Eletrônicos', price: 4599.90, stock: 23, status: 'Disponível' },
  { id: 2, name: 'Mouse Sem Fio', category: 'Periféricos', price: 89.90, stock: 150, status: 'Disponível' },
  { id: 3, name: 'Teclado Mecânico RGB', category: 'Periféricos', price: 349.90, stock: 5, status: 'Baixo Estoque' },
  { id: 4, name: 'Monitor 27" 4K', category: 'Eletrônicos', price: 2199.00, stock: 0, status: 'Esgotado' },
  { id: 5, name: 'Webcam Full HD', category: 'Periféricos', price: 199.90, stock: 42, status: 'Disponível' },
  { id: 6, name: 'Headset Gamer 7.1', category: 'Áudio', price: 279.90, stock: 3, status: 'Baixo Estoque' },
  { id: 7, name: 'Caixa de Som Bluetooth', category: 'Áudio', price: 159.90, stock: 67, status: 'Disponível' },
  { id: 8, name: 'SSD 1TB NVMe', category: 'Armazenamento', price: 499.90, stock: 0, status: 'Esgotado' },
  { id: 9, name: 'Hub USB-C 7 em 1', category: 'Periféricos', price: 189.90, stock: 28, status: 'Disponível' },
  { id: 10, name: 'Cadeira Ergonômica', category: 'Mobiliário', price: 1299.00, stock: 8, status: 'Disponível' },
  { id: 11, name: 'Suporte p/ Notebook', category: 'Mobiliário', price: 129.90, stock: 45, status: 'Disponível' },
  { id: 12, name: 'Memória RAM 16GB', category: 'Armazenamento', price: 329.90, stock: 2, status: 'Baixo Estoque' },
];

const searchQuery = ref('');
const categoryFilter = ref('all');
const sortField = ref<keyof Product>('name');
const sortAsc = ref(true);

const categories = ['all', ...new Set(products.map(p => p.category))];

const filteredProducts = computed(() => {
  let result = [...products];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q));
  }

  if (categoryFilter.value !== 'all') {
    result = result.filter(p => p.category === categoryFilter.value);
  }

  result.sort((a, b) => {
    const aVal = a[sortField.value];
    const bVal = b[sortField.value];
    const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
    return sortAsc.value ? cmp : -cmp;
  });

  return result;
});

function toggleSort(field: keyof Product) {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value;
  } else {
    sortField.value = field;
    sortAsc.value = true;
  }
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function statusColor(status: string): string {
  if (status === 'Disponível') return 'success';
  if (status === 'Baixo Estoque') return 'warning';
  return 'danger';
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/home" />
        </IonButtons>
        <IonTitle>Tabela de Produtos</IonTitle>
      </IonToolbar>
      <IonToolbar>
        <IonSearchbar
          :value="searchQuery"
          placeholder="Buscar produto..."
          :debounce="200"
          @ion-input="(e: CustomEvent) => searchQuery = e.detail.value ?? ''"
        />
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <div class="filters">
        <IonSelect
          v-model="categoryFilter"
          label="Categoria"
          label-placement="floating"
          interface="popover"
          class="category-select"
        >
          <IonSelectOption
            v-for="cat in categories"
            :key="cat"
            :value="cat"
          >
            {{ cat === 'all' ? 'Todas' : cat }}
          </IonSelectOption>
        </IonSelect>
        <div class="result-count">
          {{ filteredProducts.length }} produto{{ filteredProducts.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th
                class="sortable"
                @click="toggleSort('name')"
              >
                Produto
                <IonIcon
                  v-if="sortField === 'name'"
                  :icon="sortAsc ? arrowUpOutline : arrowDownOutline"
                />
              </th>
              <th class="hide-mobile">
                Categoria
              </th>
              <th
                class="sortable text-right"
                @click="toggleSort('price')"
              >
                Preço
                <IonIcon
                  v-if="sortField === 'price'"
                  :icon="sortAsc ? arrowUpOutline : arrowDownOutline"
                />
              </th>
              <th
                class="sortable text-right hide-mobile"
                @click="toggleSort('stock')"
              >
                Estoque
                <IonIcon
                  v-if="sortField === 'stock'"
                  :icon="sortAsc ? arrowUpOutline : arrowDownOutline"
                />
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="product in filteredProducts"
              :key="product.id"
            >
              <td>
                <strong>{{ product.name }}</strong>
                <span class="mobile-category">{{ product.category }}</span>
              </td>
              <td class="hide-mobile">
                {{ product.category }}
              </td>
              <td class="text-right">
                {{ formatCurrency(product.price) }}
              </td>
              <td class="text-right hide-mobile">
                {{ product.stock }}
              </td>
              <td>
                <IonChip
                  :color="statusColor(product.status)"
                  class="status-chip"
                >
                  <IonLabel>{{ product.status }}</IonLabel>
                </IonChip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.category-select {
  max-width: 200px;
}

.result-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.data-table th,
.data-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  background: var(--color-surface);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  user-select: none;
}

.data-table tbody tr:hover {
  background: var(--color-surface);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.sortable {
  cursor: pointer;
}

.sortable ion-icon {
  font-size: 12px;
  vertical-align: middle;
  margin-left: 2px;
}

.text-right {
  text-align: right;
}

.status-chip {
  height: 24px;
  font-size: var(--font-size-xs);
}

.mobile-category {
  display: none;
}

@media (max-width: 640px) {
  .hide-mobile {
    display: none;
  }

  .mobile-category {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--color-text-secondary);
    margin-top: 2px;
  }
}
</style>
