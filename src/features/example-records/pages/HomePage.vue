<template>
  <ion-page>
    <PageHeader title="PWA Starter Kit" />
    <ion-content class="ion-padding">
      <div class="home-container">
        <section class="hero">
          <h1 class="hero-title">PWA Starter Kit</h1>
          <p class="hero-subtitle">
            Base reutilizável para aplicações mobile-first, instaláveis e com dados locais.
          </p>
          <ConnectionStatus />
        </section>

        <section class="info-section">
          <h2 class="section-title">Funcionalidades</h2>
          <ion-list lines="none">
            <ion-item>
              <ion-icon :icon="phonePortraitOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Mobile-first</h3>
                <p>Interface compacta otimizada para telas pequenas</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="cloudOfflineOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Offline-first</h3>
                <p>Funciona sem internet após o primeiro carregamento</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="serverOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Dados locais</h3>
                <p>IndexedDB com Dexie.js para persistência estruturada</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-icon :icon="downloadOutline" slot="start" color="primary" />
              <ion-label>
                <h3>Exportação e importação</h3>
                <p>Backup e recuperação dos dados do dispositivo</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </section>

        <section class="info-section">
          <h2 class="section-title">Demonstração</h2>
          <p class="section-text">
            Esta é a aplicação de demonstração do Starter Kit. Use a aba
            <strong>Registros</strong> para testar a persistência local.
          </p>
          <ion-button expand="block" router-link="/records" fill="outline" size="default">
            <ion-icon :icon="listOutline" slot="start" />
            Ver registros de demonstração
          </ion-button>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonButton,
} from '@ionic/vue'
import {
  phonePortraitOutline,
  cloudOfflineOutline,
  serverOutline,
  downloadOutline,
  listOutline,
} from 'ionicons/icons'
import PageHeader from '../../../components/ui/PageHeader.vue'
import ConnectionStatus from '../../../components/feedback/ConnectionStatus.vue'
</script>

<style scoped>
.home-container {
  max-width: 600px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  padding: var(--space-6) 0 var(--space-4);
}

.hero-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.hero-subtitle {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

.info-section {
  margin-bottom: var(--space-6);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
  padding: 0 var(--space-4);
}

.section-text {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
  padding: 0 var(--space-4);
}

ion-item h3 {
  font-size: var(--font-size-base) !important;
  font-weight: var(--font-weight-medium) !important;
}

ion-item p {
  font-size: var(--font-size-sm) !important;
  color: var(--color-text-muted) !important;
}
</style>
