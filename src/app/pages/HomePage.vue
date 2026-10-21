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
  gridOutline,
  imagesOutline,
  storefrontOutline,
  logInOutline,
  personAddOutline,
  bagHandleOutline,
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

const examplePages = [
  {
    icon: gridOutline,
    title: 'Tabela de Dados',
    description: 'Grid com produtos, filtros, ordenação e busca.',
    route: '/examples/data-table',
    color: '#1565C0',
  },
  {
    icon: imagesOutline,
    title: 'Galeria de Imagens',
    description: 'Grid responsivo com visualização em modal.',
    route: '/examples/image-gallery',
    color: '#2E7D32',
  },
  {
    icon: storefrontOutline,
    title: 'Galeria de Lojas',
    description: 'Cards com rating, localização e horários.',
    route: '/examples/store-gallery',
    color: '#E65100',
  },
  {
    icon: bagHandleOutline,
    title: 'Detalhes de Produto',
    description: 'Página de item com preço, specs e ações.',
    route: '/examples/item-detail',
    color: '#6A1B9A',
  },
  {
    icon: logInOutline,
    title: 'Login',
    description: 'Tela de autenticação com login social.',
    route: '/examples/login',
    color: '#24527a',
  },
  {
    icon: personAddOutline,
    title: 'Cadastro',
    description: 'Formulário com validação em tempo real.',
    route: '/examples/signup',
    color: '#00695C',
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
        <IonCard
          v-for="feature in features"
          :key="feature.title"
          class="feature-card"
        >
          <IonCardHeader>
            <IonIcon
              :icon="feature.icon"
              class="feature-card__icon"
            />
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
        <IonButton
          expand="block"
          @click="router.push('/records')"
        >
          Ver Registros
        </IonButton>
      </div>

      <div class="examples-section">
        <h2 class="section-title">
          Páginas de Exemplo
        </h2>
        <p class="section-subtitle">
          Explore diferentes padrões de UI e conteúdo
        </p>

        <div class="examples-grid">
          <button
            v-for="page in examplePages"
            :key="page.route"
            class="example-card"
            @click="router.push(page.route)"
          >
            <div
              class="example-card__icon-wrapper"
              :style="{ background: page.color }"
            >
              <IonIcon
                :icon="page.icon"
                class="example-card__icon"
              />
            </div>
            <div class="example-card__content">
              <h3 class="example-card__title">
                {{ page.title }}
              </h3>
              <p class="example-card__description">
                {{ page.description }}
              </p>
            </div>
          </button>
        </div>
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

.examples-section {
  margin-top: var(--spacing-2xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.section-title {
  font-size: var(--font-size-xl);
  margin: 0 0 var(--spacing-xs);
  color: var(--color-text-primary);
}

.section-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-lg);
}

.examples-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-sm);
}

@media (min-width: 480px) {
  .examples-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.example-card {
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.example-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.example-card__icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.example-card__icon {
  font-size: 22px;
  color: white;
}

.example-card__content {
  min-width: 0;
}

.example-card__title {
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin: 0 0 2px;
  color: var(--color-text-primary);
}

.example-card__description {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.4;
}
</style>
