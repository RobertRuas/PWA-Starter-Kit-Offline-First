<template>
  <div>
    <Toolbar>
      <template #start>
        <Button icon="pi pi-arrow-left" text rounded @click="router.push('/home')" />
        <span style="font-weight: 600; font-size: 1.1rem; margin-left: 0.5rem;">Galeria de Imagens</span>
      </template>
    </Toolbar>

    <div style="padding: 1rem;">
      <p style="color: var(--p-text-muted-color); text-align: center; margin-bottom: 1rem;">
        Explore nossa colecao de paisagens
      </p>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem;">
        <Card
          v-for="img in images"
          :key="img.id"
          style="cursor: pointer; overflow: hidden;"
          @click="selectedImage = img"
        >
          <template #header>
            <div
              style="aspect-ratio: 1; display: flex; align-items: center; justify-content: center;"
              :style="{ background: `linear-gradient(135deg, ${img.color}, ${img.color}dd)` }"
            >
              <span style="font-size: 3rem;">{{ img.icon }}</span>
            </div>
          </template>
          <template #content>
            <div style="font-weight: 500; font-size: 0.875rem;">{{ img.title }}</div>
            <div style="color: var(--p-text-muted-color); font-size: 0.75rem;">{{ img.description }}</div>
          </template>
        </Card>
      </div>

      <Dialog v-model:visible="dialogVisible" :header="selectedImage?.title ?? ''" modal style="width: 90vw; max-width: 600px;">
        <div v-if="selectedImage">
          <div
            style="width: 100%; aspect-ratio: 16 / 9; border-radius: var(--p-border-radius); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;"
            :style="{ background: `linear-gradient(135deg, ${selectedImage.color}, ${selectedImage.color}cc)` }"
          >
            <span style="font-size: 6rem;">{{ selectedImage.icon }}</span>
          </div>
          <h2 style="margin: 0 0 0.5rem;">{{ selectedImage.title }}</h2>
          <p style="color: var(--p-text-muted-color); margin: 0 0 1rem;">{{ selectedImage.description }}</p>
          <div style="display: flex; gap: 1.5rem; font-size: 0.875rem; color: var(--p-text-muted-color);">
            <span>Resolucao: 3840 x 2160</span>
            <span>Formato: JPEG</span>
          </div>
        </div>
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dialog from 'primevue/dialog'

const router = useRouter()

interface GalleryImage {
  id: number
  title: string
  description: string
  color: string
  icon: string
}

const images: GalleryImage[] = [
  { id: 1, title: 'Montanhas ao Amanhecer', description: 'Paisagem com montanhas e nevoeiro', color: '#2d5a27', icon: '🏔️' },
  { id: 2, title: 'Praia Tropical', description: 'Areia branca e aguas cristalinas', color: '#1a6b8a', icon: '🏖️' },
  { id: 3, title: 'Floresta Encantada', description: 'Trilha entre arvores centenarias', color: '#1b4332', icon: '🌲' },
  { id: 4, title: 'Cidade a Noite', description: 'Luzes urbanas e arranha-ceus', color: '#1a1a2e', icon: '🌃' },
  { id: 5, title: 'Cachoeira Veu de Noiva', description: 'Queda d\'agua em meio a mata', color: '#264653', icon: '💧' },
  { id: 6, title: 'Deserto Dourado', description: 'Dunas infinitas ao por do sol', color: '#8a5a00', icon: '🏜️' },
  { id: 7, title: 'Aurora Boreal', description: 'Fenomeno natural espetacular', color: '#0d3b66', icon: '🌌' },
  { id: 8, title: 'Jardim Botanico', description: 'Flores multicoloridas e caminhos', color: '#606c38', icon: '🌸' },
  { id: 9, title: 'Lago Espelhado', description: 'Reflexo perfeito das montanhas', color: '#3a5a7c', icon: '🏞️' },
]

const selectedImage = ref<GalleryImage | null>(null)
const dialogVisible = computed({
  get: () => !!selectedImage.value,
  set: (val) => { if (!val) selectedImage.value = null },
})
</script>
