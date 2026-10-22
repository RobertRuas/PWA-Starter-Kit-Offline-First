<template>
  <div>
    <PageHeader title="Dashboard" subtitle="Visao geral financeira" show-back back-href="/home" />

    <div class="dashboard-content">
      <!-- KPI Cards -->
      <div class="kpi-grid">
        <Card v-for="kpi in kpis" :key="kpi.label" class="kpi-card">
          <template #content>
            <div class="kpi-body">
              <div class="kpi-icon-wrapper" :style="{ background: kpi.bgColor }">
                <i :class="kpi.icon" class="kpi-icon" :style="{ color: kpi.iconColor }" />
              </div>
              <div>
                <div class="kpi-value">{{ kpi.value }}</div>
                <div class="kpi-label">{{ kpi.label }}</div>
              </div>
              <Tag
                :value="kpi.trend"
                :severity="kpi.trendUp ? 'success' : 'danger'"
                rounded
                class="kpi-trend"
              />
            </div>
          </template>
        </Card>
      </div>

      <!-- Recent transactions -->
      <Card>
        <template #title>Transacoes recentes</template>
        <template #content>
          <DataTable
            :value="transactions"
            data-key="id"
            striped-rows
            responsive-layout="scroll"
            :rows="8"
            :paginator="transactions.length > 8"
          >
            <Column field="description" header="Descricao" sortable>
              <template #body="{ data }">
                <div class="tx-desc">
                  <i :class="data.icon" class="tx-icon" />
                  <span>{{ data.description }}</span>
                </div>
              </template>
            </Column>
            <Column field="category" header="Categoria" sortable class="hide-mobile" />
            <Column field="date" header="Data" sortable style="width: 110px;">
              <template #body="{ data }">
                <span class="tx-date">{{ data.date }}</span>
              </template>
            </Column>
            <Column field="amount" header="Valor" sortable style="width: 130px; text-align: right;">
              <template #body="{ data }">
                <span :class="data.amount > 0 ? 'tx-positive' : 'tx-negative'">
                  {{ formatCurrency(data.amount) }}
                </span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <!-- Categories breakdown -->
      <Card>
        <template #title>Despesas por categoria</template>
        <template #content>
          <div class="category-list">
            <div v-for="cat in categories" :key="cat.name" class="category-item">
              <div class="category-info">
                <div class="category-color" :style="{ background: cat.color }" />
                <div>
                  <div class="category-name">{{ cat.name }}</div>
                  <div class="category-amount">{{ formatCurrency(cat.amount) }}</div>
                </div>
              </div>
              <ProgressBar :value="cat.percent" :show-value="false" style="height: 6px; flex: 1; min-width: 80px;" />
              <span class="category-percent">{{ cat.percent }}%</span>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressBar from 'primevue/progressbar'
import PageHeader from '../../../components/ui/PageHeader.vue'

const kpis = [
  { label: 'Saldo atual', value: 'R$ 12.450,00', icon: 'pi pi-wallet', bgColor: 'var(--p-blue-50)', iconColor: 'var(--p-blue-500)', trend: '+8.2%', trendUp: true },
  { label: 'Receita mensal', value: 'R$ 8.200,00', icon: 'pi pi-arrow-up', bgColor: 'var(--p-green-50)', iconColor: 'var(--p-green-500)', trend: '+12.5%', trendUp: true },
  { label: 'Despesas', value: 'R$ 3.780,00', icon: 'pi pi-arrow-down', bgColor: 'var(--p-red-50)', iconColor: 'var(--p-red-500)', trend: '-3.1%', trendUp: false },
  { label: 'Economia', value: 'R$ 4.420,00', icon: 'pi pi-chart-line', bgColor: 'var(--p-purple-50)', iconColor: 'var(--p-purple-500)', trend: '+24.0%', trendUp: true },
]

const transactions = [
  { id: 1, description: 'Salario', category: 'Renda', date: '01/10', amount: 8200, icon: 'pi pi-briefcase' },
  { id: 2, description: 'Aluguel', category: 'Moradia', date: '05/10', amount: -1500, icon: 'pi pi-home' },
  { id: 3, description: 'Supermercado', category: 'Alimentacao', date: '08/10', amount: -680, icon: 'pi pi-shopping-cart' },
  { id: 4, description: 'Freelance', category: 'Renda', date: '10/10', amount: 2500, icon: 'pi pi-code' },
  { id: 5, description: 'Transporte', category: 'Transporte', date: '12/10', amount: -320, icon: 'pi pi-car' },
  { id: 6, description: 'Internet', category: 'Servicos', date: '15/10', amount: -120, icon: 'pi pi-wifi' },
  { id: 7, description: 'Restaurante', category: 'Alimentacao', date: '17/10', amount: -185, icon: 'pi pi-building' },
  { id: 8, description: 'Farmacia', category: 'Saude', date: '19/10', amount: -95, icon: 'pi pi-heart' },
  { id: 9, description: 'Streaming', category: 'Entretenimento', date: '20/10', amount: -45, icon: 'pi pi-play' },
  { id: 10, description: 'Investimento', category: 'Investimentos', date: '22/10', amount: -835, icon: 'pi pi-chart-bar' },
]

const categories = [
  { name: 'Moradia', amount: 1500, percent: 40, color: 'var(--p-blue-500)' },
  { name: 'Alimentacao', amount: 865, percent: 23, color: 'var(--p-green-500)' },
  { name: 'Investimentos', amount: 835, percent: 22, color: 'var(--p-purple-500)' },
  { name: 'Transporte', amount: 320, percent: 8, color: 'var(--p-orange-500)' },
  { name: 'Outros', amount: 260, percent: 7, color: 'var(--p-surface-400)' },
]

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
</script>

<style scoped>
.dashboard-content {
  padding: 0 1.5rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.kpi-body {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.kpi-icon-wrapper {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: var(--p-border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-icon {
  font-size: 1.25rem;
}

.kpi-value {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.3;
}

.kpi-label {
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.kpi-trend {
  margin-left: auto;
}

.tx-desc {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tx-icon {
  color: var(--p-text-muted-color);
}

.tx-date {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.tx-positive {
  color: var(--p-green-500);
  font-weight: 600;
}

.tx-negative {
  color: var(--p-red-500);
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
}

.category-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.category-amount {
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
}

.category-percent {
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
}

@media (max-width: 640px) {
  .dashboard-content {
    padding: 0 1rem 2rem;
  }

  .kpi-grid {
    grid-template-columns: 1fr 1fr;
  }

  :deep(.hide-mobile) {
    display: none;
  }
}

@media (max-width: 400px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
