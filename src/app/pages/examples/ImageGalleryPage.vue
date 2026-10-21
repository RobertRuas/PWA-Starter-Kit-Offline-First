<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonModal,
  IonButton,
  IonIcon,
} from '@ionic/vue';
import { closeOutline, expandOutline } from 'ionicons/icons';

interface GalleryImage {
  id: number;
  title: string;
  description: string;
  color: string;
  icon: string;
}

const images: GalleryImage[] = [
  { id: 1, title: 'Montanhas ao Amanhecer', description: 'Paisagem com montanhas e nevoeiro', color: '#2d5a27', icon: '🏔️' },
  { id: 2, title: 'Praia Tropical', description: 'Areia branca e águas cristalinas', color: '#1a6b8a', icon: '🏖️' },
  { id: 3, title: 'Floresta Encantada', description: 'Trilha entre árvores centenárias', color: '#1b4332', icon: '🌲' },
  { id: 4, title: 'Cidade à Noite', description: 'Luzes urbanas e arranha-céus', color: '#1a1a2e', icon: '🌃' },
  { id: 5, title: 'Cachoeira Véu de Noiva', description: 'Queda d\'água em meio à mata', color: '#264653', icon: '💧' },
  { id: 6, title: 'Deserto Dourado', description: 'Dunas infinitas ao pôr do sol', color: '#8a5a00', icon: '🏜️' },
  { id: 7, title: 'Aurora Boreal', description: 'Fenômeno natural espetacular', color: '#0d3b66', icon: '🌌' },
  { id: 8, title: 'Jardim Botânico', description: 'Flores multicoloridas e caminhos', color: '#606c38', icon: '🌸' },
  { id: 9, title: 'Lago Espelhado', description: 'Reflexo perfeito das montanhas', color: '#3a5a7c', icon: '🏞️' },
];

const selectedImage = ref<GalleryImage | null>(null);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/home" />
        </IonButtons>
        <IonTitle>Galeria de Imagens</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <p class="gallery-subtitle">
        Explore nossa coleção de paisagens
      </p>

      <div class="gallery-grid">
        <button
          v-for="img in images"
          :key="img.id"
          class="gallery-item"
          @click="selectedImage = img"
        >
          <div
            class="gallery-item__image"
            :style="{ background: `linear-gradient(135deg, ${img.color}, ${img.color}dd)` }"
          >
            <span class="gallery-item__icon">{{ img.icon }}</span>
            <div class="gallery-item__overlay">
              <IonIcon :icon="expandOutline" />
            </div>
          </div>
          <div class="gallery-item__info">
            <h3>{{ img.title }}</h3>
            <p>{{ img.description }}</p>
          </div>
        </button>
      </div>

      <IonModal
        :is-open="!!selectedImage"
        @did-dismiss="selectedImage = null"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>{{ selectedImage?.title }}</IonTitle>
            <IonButtons slot="end">
              <IonButton @click="selectedImage = null">
                <IonIcon
                  slot="icon-only"
                  :icon="closeOutline"
                />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent
          v-if="selectedImage"
          class="ion-padding"
        >
          <div
            class="detail-image"
            :style="{ background: `linear-gradient(135deg, ${selectedImage.color}, ${selectedImage.color}cc)` }"
          >
            <span class="detail-icon">{{ selectedImage.icon }}</span>
          </div>
          <h2 class="detail-title">
            {{ selectedImage.title }}
          </h2>
          <p class="detail-description">
            {{ selectedImage.description }}
          </p>
          <div class="detail-meta">
            <span>Resolução: 3840 × 2160</span>
            <span>Formato: JPEG</span>
          </div>
        </IonContent>
      </IonModal>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.gallery-subtitle {
  color: var(--color-text-secondary);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: var(--spacing-md);
}

.gallery-item {
  all: unset;
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.gallery-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.gallery-item__image {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.gallery-item__icon {
  font-size: 48px;
}

.gallery-item__overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity var(--transition-fast);
  color: white;
  font-size: 24px;
}

.gallery-item:hover .gallery-item__overlay {
  opacity: 1;
}

.gallery-item__info {
  padding: var(--spacing-sm);
}

.gallery-item__info h3 {
  font-size: var(--font-size-sm);
  margin: 0 0 2px;
  color: var(--color-text-primary);
}

.gallery-item__info p {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
}

.detail-image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.detail-icon {
  font-size: 96px;
}

.detail-title {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--spacing-sm);
  color: var(--color-text-primary);
}

.detail-description {
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-lg);
}

.detail-meta {
  display: flex;
  gap: var(--spacing-lg);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}
</style>
