<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonButton,
} from '@ionic/vue';
import {
  documentTextOutline,
  cloudOfflineOutline,
  downloadOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { appConfig } from '../config/app.config';
import ConnectionStatus from '../../components/feedback/ConnectionStatus.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const features = [
  {
    icon: cloudOfflineOutline,
    title: 'Offline-First',
    description: 'Funciona sem internet após o primeiro carregamento.',
  },
  {
    icon: documentTextOutline,
    title: 'Dados Locais',
    description: 'Seus dados ficam salvos no dispositivo com IndexedDB.',
  },
  {
    icon: downloadOutline,
    title: 'Exportação & Backup',
    description: 'Exporte e importe seus dados a qualquer momento.',
  },
  {
    icon: shieldCheckmarkOutline,
    title: 'Privacidade',
    description: 'Nenhum dado é enviado sem sua autorização.',
  },
];
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ appConfig.name }}</IonTitle>
        <template #end>
          <ConnectionStatus />
        </template>
      </IonToolbar>
    </IonHeader>

    <IonContent class="ion-padding">
      <div class="welcome">
        <h1 class="welcome__title">
          {{ appConfig.name }}
        </h1>
        <p class="welcome__subtitle">
          {{ appConfig.description }}
        </p>
      </div>

      <div class="features-grid">
        <IonCard v-for="feature in features" :key="feature.title" class="feature-card">
          <IonCardHeader>
            <IonIcon :icon="feature.icon" class="feature-card__icon" />
            <IonCardTitle class="feature-card__title">
              {{ feature.title }}
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {{ feature.description }}
          </IonCardContent>
        </IonCard>
      </div>

      <div class="cta">
        <IonButton expand="block" @click="router.push('/records')"> Ver Registros </IonButton>
      </div>
    </IonContent>
  </IonPage>
</template>

<style scoped>
.welcome {
  text-align: center;
  padding: var(--spacing-lg) 0;
}

.welcome__title {
  font-size: var(--font-size-2xl);
  margin: 0 0 var(--spacing-sm);
  color: var(--color-primary);
}

.welcome__subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin: 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-sm);
  margin: var(--spacing-lg) 0;
}

.feature-card {
  text-align: center;
}

.feature-card__icon {
  font-size: 32px;
  color: var(--color-primary);
  margin-bottom: var(--spacing-xs);
}

.feature-card__title {
  font-size: var(--font-size-sm);
}

.cta {
  margin-top: var(--spacing-lg);
}
</style>
