<template>
  <div>
    <Toolbar>
      <template #start>
        <Button icon="pi pi-arrow-left" text rounded @click="router.push('/home')" />
        <span style="font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">Lojas</span>
      </template>
    </Toolbar>

    <div style="padding: 1rem;">
      <IconField style="margin-bottom: 1rem;">
        <InputIcon class="pi pi-search" />
        <InputText v-model="searchQuery" placeholder="Buscar loja ou categoria..." style="width: 100%;" />
      </IconField>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
        <Card v-for="s in filteredStores" :key="s.id" style="overflow: hidden;">
          <template #header>
            <div
              style="height: 120px; display: flex; align-items: center; justify-content: center; position: relative;"
              :style="{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)` }"
            >
              <span style="font-size: 3rem;">{{ s.icon }}</span>
              <Tag :value="s.category" style="position: absolute; top: 0.5rem; right: 0.5rem;" />
            </div>
          </template>
          <template #content>
            <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">{{ s.name }}</div>
            <div style="display: flex; align-items: center; gap: 2px; margin-bottom: 0.5rem;">
              <i v-for="i in Math.round(s.rating)" :key="'f'+i" class="pi pi-star-fill" style="font-size: 0.875rem; color: #f59e0b;" />
              <i v-for="i in (5 - Math.round(s.rating))" :key="'e'+i" class="pi pi-star" style="font-size: 0.875rem; color: var(--p-text-muted-color);" />
              <span style="font-size: 0.75rem; color: var(--p-text-muted-color); margin-left: 0.25rem;">{{ s.rating }} ({{ s.reviews }})</span>
            </div>
            <p style="color: var(--p-text-muted-color); font-size: 0.875rem; line-height: 1.5; margin: 0 0 1rem;">{{ s.description }}</p>
            <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
              <span style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--p-text-muted-color);">
                <i class="pi pi-map-marker" style="font-size: 0.875rem;" /> {{ s.location }}
              </span>
              <span style="display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; color: var(--p-text-muted-color);">
                <i class="pi pi-clock" style="font-size: 0.875rem;" /> {{ s.hours }}
              </span>
            </div>
          </template>
        </Card>
      </div>
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
import Card from 'primevue/card'
import Tag from 'primevue/tag'

const router = useRouter()

interface Store {
  id: number
  name: string
  description: string
  category: string
  rating: number
  reviews: number
  location: string
  hours: string
  color: string
  icon: string
}

const stores: Store[] = [
  { id: 1, name: 'Cafe Aroma', description: 'Cafes especiais torrados artesanalmente. Ambiente acolhedor com Wi-Fi gratuito.', category: 'Cafeteria', rating: 4.8, reviews: 234, location: 'Centro', hours: '7h - 20h', color: '#5D4037', icon: '☕' },
  { id: 2, name: 'Tech Store Pro', description: 'Loja especializada em eletronicos e gadgets de ultima geracao.', category: 'Eletronicos', rating: 4.5, reviews: 567, location: 'Shopping Norte', hours: '10h - 22h', color: '#1565C0', icon: '💻' },
  { id: 3, name: 'Botanica Verde', description: 'Plantas ornamentais, vasos artesanais e consultoria em paisagismo.', category: 'Jardinagem', rating: 4.9, reviews: 89, location: 'Vila Madalena', hours: '8h - 18h', color: '#2E7D32', icon: '🌿' },
  { id: 4, name: 'Padaria Trigo Dourado', description: 'Paes artesanais, bolos e doces feitos com ingredientes selecionados.', category: 'Padaria', rating: 4.7, reviews: 412, location: 'Pinheiros', hours: '6h - 21h', color: '#E65100', icon: '🥖' },
  { id: 5, name: 'Livraria Paginas', description: 'Acervo curado com titulos nacionais e importados. Clube do livro mensal.', category: 'Livraria', rating: 4.6, reviews: 178, location: 'Jardins', hours: '9h - 21h', color: '#4A148C', icon: '📚' },
  { id: 6, name: 'Fit & Forte', description: 'Suplementos, roupas fitness e acessorios para treino.', category: 'Esportes', rating: 4.3, reviews: 95, location: 'Moema', hours: '8h - 20h', color: '#C62828', icon: '💪' },
  { id: 7, name: 'Pet Palace', description: 'Tudo para seu pet: racao premium, brinquedos, banho e tosa.', category: 'Pet Shop', rating: 4.8, reviews: 321, location: 'Itaim', hours: '8h - 19h', color: '#00695C', icon: '🐾' },
  { id: 8, name: 'Atelier de Artes', description: 'Materiais artisticos profissionais e cursos de pintura e escultura.', category: 'Artes', rating: 4.4, reviews: 63, location: 'Bela Vista', hours: '10h - 18h', color: '#AD1457', icon: '🎨' },
]

const searchQuery = ref('')

const filteredStores = computed(() => {
  if (!searchQuery.value) return stores
  const q = searchQuery.value.toLowerCase()
  return stores.filter(
    (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
  )
})
</script>
