<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonIcon,
  IonChip,
  IonLabel,
  IonSearchbar,
} from '@ionic/vue';
import {
  starOutline,
  star,
  locationOutline,
  timeOutline,
} from 'ionicons/icons';

interface Store {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  hours: string;
  color: string;
  icon: string;
}

const stores: Store[] = [
  { id: 1, name: 'Café Aroma', description: 'Cafés especiais torrados artesanalmente. Ambiente acolhedor com Wi-Fi gratuito.', category: 'Cafeteria', rating: 4.8, reviews: 234, location: 'Centro', hours: '7h - 20h', color: '#5D4037', icon: '☕' },
  { id: 2, name: 'Tech Store Pro', description: 'Loja especializada em eletrônicos e gadgets de última geração.', category: 'Eletrônicos', rating: 4.5, reviews: 567, location: 'Shopping Norte', hours: '10h - 22h', color: '#1565C0', icon: '💻' },
  { id: 3, name: 'Botânica Verde', description: 'Plantas ornamentais, vasos artesanais e consultoria em paisagismo.', category: 'Jardinagem', rating: 4.9, reviews: 89, location: 'Vila Madalena', hours: '8h - 18h', color: '#2E7D32', icon: '🌿' },
  { id: 4, name: 'Padaria Trigo Dourado', description: 'Pães artesanais, bolos e doces feitos com ingredientes selecionados.', category: 'Padaria', rating: 4.7, reviews: 412, location: 'Pinheiros', hours: '6h - 21h', color: '#E65100', icon: '🥖' },
  { id: 5, name: 'Livraria Páginas', description: 'Acervo curado com títulos nacionais e importados. Clube do livro mensal.', category: 'Livraria', rating: 4.6, reviews: 178, location: 'Jardins', hours: '9h - 21h', color: '#4A148C', icon: '📚' },
  { id: 6, name: 'Fit & Forte', description: 'Suplementos, roupas fitness e acessórios para treino.', category: 'Esportes', rating: 4.3, reviews: 95, location: 'Moema', hours: '8h - 20h', color: '#C62828', icon: '💪' },
  { id: 7, name: 'Pet Palace', description: 'Tudo para seu pet: ração premium, brinquedos, banho e tosa.', category: 'Pet Shop', rating: 4.8, reviews: 321, location: 'Itaim', hours: '8h - 19h', color: '#00695C', icon: '🐾' },
  { id: 8, name: 'Atelier de Artes', description: 'Materiais artísticos profissionais e cursos de pintura e escultura.', category: 'Artes', rating: 4.4, reviews: 63, location: 'Bela Vista', hours: '10h - 18h', color: '#AD1457', icon: '🎨' },
];

const searchQuery = ref('');

const filteredStores = computed(() => {
  if (!searchQuery.value) return stores;
  const q = searchQuery.value.toLowerCase();
  return stores.filter(s =>
    s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
  );
});

function renderStars(rating: number): { filled: number; empty: number } {
  const filled = Math.round(rating);
  return { filled, empty: 5 - filled };
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/home" />
        </IonButtons>
        <IonTitle>Lojas</IonTitle>
      </IonToolbar>
      <IonToolbar>
        <IonSearchbar
          :value="searchQuery"
          placeholder="Buscar loja ou categoria..."
          :debounce="200"
          @ion-input="(e: CustomEvent) => searchQuery = e.detail.value ?? ''"
        />
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <div class="store-grid">
        <article
          v-for="s in filteredStores"
          :key="s.id"
          class="store-card"
        >
          <div
            class="store-card__banner"
            :style="{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)` }"
          >
            <span class="store-card__icon">{{ s.icon }}</span>
            <IonChip class="store-card__category">
              <IonLabel>{{ s.category }}</IonLabel>
            </IonChip>
          </div>
          <div class="store-card__body">
            <h3 class="store-card__name">
              {{ s.name }}
            </h3>
            <div class="store-card__rating">
              <template
                v-for="i in renderStars(s.rating).filled"
                :key="'f' + i"
              >
                <IonIcon
                  :icon="star"
                  class="star star--filled"
                />
              </template>
              <template
                v-for="i in renderStars(s.rating).empty"
                :key="'e' + i"
              >
                <IonIcon
                  :icon="starOutline"
                  class="star"
                />
              </template>
              <span class="store-card__rating-text">{{ s.rating }} ({{ s.reviews }})</span>
            </div>
            <p class="store-card__description">
              {{ s.description }}
            </p>
            <div class="store-card__meta">
              <span class="store-card__meta-item">
                <IonIcon :icon="locationOutline" />
                {{ s.location }}
              </span>
              <span class="store-card__meta-item">
                <IonIcon :icon="timeOutline" />
                {{ s.hours }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
}

.store-card {
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.store-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.store-card__banner {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.store-card__icon {
  font-size: 48px;
}

.store-card__category {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  --background: rgba(255, 255, 255, 0.9);
  --color: #333;
  height: 24px;
  font-size: var(--font-size-xs);
}

.store-card__body {
  padding: var(--spacing-md);
}

.store-card__name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text-primary);
}

.store-card__rating {
  display: flex;
  align-items: center;
  gap: 1px;
  margin-bottom: var(--spacing-sm);
}

.star {
  font-size: 14px;
  color: var(--color-text-disabled);
}

.star--filled {
  color: #f59e0b;
}

.store-card__rating-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-xs);
}

.store-card__description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md);
  line-height: 1.5;
}

.store-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.store-card__meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.store-card__meta-item ion-icon {
  font-size: 14px;
}
</style>
