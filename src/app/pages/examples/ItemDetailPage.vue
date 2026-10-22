<template>
  <div>
    <Toolbar>
      <template #start>
        <Button icon="pi pi-arrow-left" text rounded @click="router.push('/home')" />
        <span style="font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">Detalhes</span>
      </template>
      <template #end>
        <Button icon="pi pi-share-alt" text rounded />
        <Button icon="pi pi-heart" text rounded />
      </template>
    </Toolbar>

    <div style="padding: 1rem;">
      <div
        style="width: 100%; aspect-ratio: 4 / 3; border-radius: var(--p-border-radius); display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 1.5rem;"
        :style="{ background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)` }"
      >
        <span style="font-size: 6rem;">{{ product.icon }}</span>
        <Tag :value="`-${discount}%`" severity="danger" style="position: absolute; top: 0.5rem; left: 0.5rem;" />
      </div>

      <div style="margin-bottom: 2rem;">
        <span style="font-size: 0.875rem; color: var(--p-primary-color); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">{{ product.brand }}</span>
        <h1 style="margin: 0.25rem 0 0.5rem; line-height: 1.3;">{{ product.name }}</h1>

        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          <div style="display: flex; gap: 1px;">
            <i v-for="i in Math.round(product.rating)" :key="'f'+i" class="pi pi-star-fill" style="color: #f59e0b;" />
            <i v-for="i in (5 - Math.round(product.rating))" :key="'e'+i" class="pi pi-star" style="color: var(--p-text-muted-color);" />
          </div>
          <span style="font-size: 0.875rem; color: var(--p-text-muted-color);">{{ product.rating }} ({{ product.reviews }} avaliacoes)</span>
        </div>

        <div style="display: flex; align-items: baseline; gap: 0.5rem; margin-bottom: 1rem;">
          <span style="font-size: 1.5rem; font-weight: 700;">{{ formatCurrency(product.price) }}</span>
          <span style="text-decoration: line-through; color: var(--p-text-muted-color);">{{ formatCurrency(product.originalPrice) }}</span>
        </div>

        <p style="color: var(--p-text-muted-color); line-height: 1.6; margin: 0 0 1.5rem;">{{ product.description }}</p>

        <div style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem; background: var(--p-content-background); border-radius: var(--p-border-radius); margin-bottom: 1.5rem; border: 1px solid var(--p-content-border-color);">
          <span v-for="badge in trustBadges" :key="badge.label" style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--p-green-500);">
            <i :class="badge.icon" style="font-size: 1rem;" /> {{ badge.label }}
          </span>
        </div>

        <h2 style="margin: 0 0 0.5rem;">Caracteristicas</h2>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
          <div v-for="feature in product.features" :key="feature" style="display: flex; align-items: center; gap: 0.5rem; color: var(--p-text-muted-color); font-size: 0.875rem;">
            <i class="pi pi-check-circle" style="color: var(--p-primary-color);" />
            {{ feature }}
          </div>
        </div>

        <h2 style="margin: 0 0 0.5rem;">Especificacoes</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 1.5rem;">
          <div v-for="spec in product.specs" :key="spec.label" style="padding: 0.5rem; background: var(--p-content-background); border-radius: var(--p-border-radius); border: 1px solid var(--p-content-border-color);">
            <div style="font-size: 0.75rem; color: var(--p-text-muted-color); margin-bottom: 2px;">{{ spec.label }}</div>
            <div style="font-weight: 600; font-size: 0.875rem;">{{ spec.value }}</div>
          </div>
        </div>
      </div>

      <div style="position: sticky; bottom: 0; padding: 1rem 0;">
        <Button label="Adicionar ao Carrinho" icon="pi pi-shopping-cart" style="width: 100%;" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const router = useRouter()

const product = {
  name: 'Headphone Premium Studio',
  brand: 'SoundMax',
  price: 899.9,
  originalPrice: 1199.9,
  rating: 4.7,
  reviews: 342,
  description:
    'Headphone over-ear com cancelamento de ruido ativo, drivers de 40mm, Bluetooth 5.3 e ate 30 horas de bateria. Ideal para producao musical e uso diario com conforto premium.',
  color: '#24527a',
  icon: '🎧',
  features: [
    'Cancelamento de ruido ativo (ANC)',
    'Bluetooth 5.3 + cabo P2',
    'Bateria de 30 horas',
    'Drivers de 40mm Hi-Res',
    'Dobravel e compacto',
    'Microfone integrado',
  ],
  specs: [
    { label: 'Peso', value: '250g' },
    { label: 'Impedancia', value: '32Ω' },
    { label: 'Resposta', value: '20Hz - 40kHz' },
    { label: 'Conectividade', value: 'BT 5.3 / P2' },
  ],
}

const trustBadges = [
  { icon: 'pi pi-check-circle', label: 'Produto original' },
  { icon: 'pi pi-shield', label: 'Garantia 1 ano' },
  { icon: 'pi pi-box', label: 'Frete gratis' },
]

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const discount = Math.round((1 - product.price / product.originalPrice) * 100)
</script>
