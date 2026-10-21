<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonChip,
  IonLabel,
} from '@ionic/vue';
import {
  cartOutline,
  heartOutline,
  shareOutline,
  starOutline,
  star,
  checkmarkCircleOutline,
  shieldCheckmarkOutline,
  cubeOutline,
} from 'ionicons/icons';

const product = {
  name: 'Headphone Premium Studio',
  brand: 'SoundMax',
  price: 899.90,
  originalPrice: 1199.90,
  rating: 4.7,
  reviews: 342,
  description: 'Headphone over-ear com cancelamento de ruído ativo, drivers de 40mm, Bluetooth 5.3 e até 30 horas de bateria. Ideal para produção musical e uso diário com conforto premium.',
  color: '#24527a',
  icon: '🎧',
  features: [
    'Cancelamento de ruído ativo (ANC)',
    'Bluetooth 5.3 + cabo P2',
    'Bateria de 30 horas',
    'Drivers de 40mm Hi-Res',
    'Dobrável e compacto',
    'Microfone integrado',
  ],
  specs: [
    { label: 'Peso', value: '250g' },
    { label: 'Impedância', value: '32Ω' },
    { label: 'Resposta', value: '20Hz - 40kHz' },
    { label: 'Conectividade', value: 'BT 5.3 / P2' },
  ],
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const discount = Math.round((1 - product.price / product.originalPrice) * 100);
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/home" />
        </IonButtons>
        <IonTitle>Detalhes</IonTitle>
        <IonButtons slot="end">
          <IonButton>
            <IonIcon
              slot="icon-only"
              :icon="shareOutline"
            />
          </IonButton>
          <IonButton>
            <IonIcon
              slot="icon-only"
              :icon="heartOutline"
            />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <div
        class="product-image"
        :style="{ background: `linear-gradient(135deg, ${product.color}, ${product.color}cc)` }"
      >
        <span class="product-image__icon">{{ product.icon }}</span>
        <IonChip
          class="discount-badge"
          color="danger"
        >
          <IonLabel>-{{ discount }}%</IonLabel>
        </IonChip>
      </div>

      <div class="product-info">
        <span class="product-brand">{{ product.brand }}</span>
        <h1 class="product-name">
          {{ product.name }}
        </h1>

        <div class="product-rating">
          <div class="stars">
            <template
              v-for="i in Math.round(product.rating)"
              :key="'f' + i"
            >
              <IonIcon
                :icon="star"
                class="star star--filled"
              />
            </template>
            <template
              v-for="i in (5 - Math.round(product.rating))"
              :key="'e' + i"
            >
              <IonIcon
                :icon="starOutline"
                class="star"
              />
            </template>
          </div>
          <span class="rating-text">{{ product.rating }} ({{ product.reviews }} avaliações)</span>
        </div>

        <div class="product-price">
          <span class="price-current">{{ formatCurrency(product.price) }}</span>
          <span class="price-original">{{ formatCurrency(product.originalPrice) }}</span>
        </div>

        <p class="product-description">
          {{ product.description }}
        </p>

        <div class="trust-badges">
          <div class="trust-badge">
            <IonIcon :icon="checkmarkCircleOutline" />
            <span>Produto original</span>
          </div>
          <div class="trust-badge">
            <IonIcon :icon="shieldCheckmarkOutline" />
            <span>Garantia 1 ano</span>
          </div>
          <div class="trust-badge">
            <IonIcon :icon="cubeOutline" />
            <span>Frete grátis</span>
          </div>
        </div>

        <h2 class="section-title">
          Características
        </h2>
        <ul class="features-list">
          <li
            v-for="feature in product.features"
            :key="feature"
          >
            <IonIcon
              :icon="checkmarkCircleOutline"
              class="feature-icon"
            />
            {{ feature }}
          </li>
        </ul>

        <h2 class="section-title">
          Especificações
        </h2>
        <div class="specs-grid">
          <div
            v-for="spec in product.specs"
            :key="spec.label"
            class="spec-item"
          >
            <span class="spec-label">{{ spec.label }}</span>
            <span class="spec-value">{{ spec.value }}</span>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <IonButton
          expand="block"
          class="buy-button"
        >
          <IonIcon
            slot="start"
            :icon="cartOutline"
          />
          Adicionar ao Carrinho
        </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.product-image {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-bottom: var(--space-6);
}

.product-image__icon {
  font-size: 96px;
}

.discount-badge {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  font-weight: 700;
}

.product-info {
  margin-bottom: var(--space-8);
}

.product-brand {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.product-name {
  font-size: var(--font-size-xl);
  margin: var(--space-1) 0 var(--space-2);
  color: var(--color-text-primary);
  line-height: 1.3;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  font-size: 16px;
  color: var(--color-text-muted);
}

.star--filled {
  color: #f59e0b;
}

.rating-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.product-price {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.price-current {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.price-original {
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.product-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--space-6);
}

.trust-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-6);
}

.trust-badge {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--color-success);
}

.trust-badge ion-icon {
  font-size: 16px;
}

.section-title {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--space-2);
  color: var(--color-text-primary);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.features-list li {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.feature-icon {
  color: var(--color-primary);
  font-size: 18px;
  flex-shrink: 0;
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.spec-item {
  padding: var(--space-2);
  background: var(--color-surface);
  border-radius: var(--radius-sm);
}

.spec-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}

.spec-value {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-primary);
}

.action-bar {
  position: sticky;
  bottom: 0;
  padding: var(--space-4) 0;
  background: var(--color-background);
}

.buy-button {
  --border-radius: var(--radius-md);
  font-weight: 600;
}
</style>
