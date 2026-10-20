<template>
  <ion-page>
    <PageHeader title="Demonstração" show-back back-href="/home" />
    <ion-content class="ion-padding">
      <div class="showcase-container">

        <section class="showcase-section">
          <h2 class="section-title">Componentes de feedback</h2>

          <div class="card-group">
            <h3 class="group-label">Status de conexão</h3>
            <ConnectionStatus />
          </div>

          <div class="card-group">
            <h3 class="group-label">Status de salvamento local</h3>
            <div class="status-row">
              <LocalSaveStatus status="saved" />
              <LocalSaveStatus status="saving" />
              <LocalSaveStatus status="error" />
            </div>
          </div>

          <div class="card-group">
            <h3 class="group-label">Estado vazio</h3>
            <EmptyState
              title="Nenhum item"
              description="Exemplo de estado vazio para listas sem conteúdo."
              :icon="folderOpenOutline"
            />
          </div>

          <div class="card-group">
            <h3 class="group-label">Estado de erro</h3>
            <ErrorState
              title="Falha ao carregar"
              description="Exemplo de estado de erro com botão de nova tentativa."
              retry-label="Tentar novamente"
              @retry="handleDemoRetry"
            />
          </div>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Formulário estilo iOS</h2>

          <div class="form-card">
            <div class="form-row">
              <label class="form-row-label">Nome</label>
              <input
                v-model="demoForm.name"
                type="text"
                class="form-row-input"
                placeholder="Digite seu nome"
              />
            </div>
            <div class="form-divider" />
            <div class="form-row">
              <label class="form-row-label">Email</label>
              <input
                v-model="demoForm.email"
                type="email"
                class="form-row-input"
                placeholder="exemplo@email.com"
              />
            </div>
            <div class="form-divider" />
            <div class="form-row">
              <label class="form-row-label">Notas</label>
              <textarea
                v-model="demoForm.notes"
                class="form-row-input form-row-textarea"
                placeholder="Opcional"
                rows="2"
              />
            </div>
          </div>
          <p class="form-caption">
            Campos com font-size 16px para evitar zoom no iOS Safari.
          </p>
          <ion-button expand="block" fill="outline" @click="showFormComponents = true">
            <ion-icon slot="start" :icon="listOutline" />
            Ver todos os componentes de formulário
          </ion-button>
        </section>

        <section v-if="showFormComponents" class="showcase-section">
          <div class="modal-overlay" @click="showFormComponents = false">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h2>Todos os componentes de formulário</h2>
                <ion-button fill="clear" size="small" @click="showFormComponents = false">
                  <ion-icon slot="icon-only" :icon="closeOutline" />
                </ion-button>
              </div>

              <div class="form-card">
                <div class="form-row">
                  <label class="form-row-label">Text input</label>
                  <input type="text" class="form-row-input" placeholder="Texto simples" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Email</label>
                  <input type="email" class="form-row-input" placeholder="email@example.com" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Número</label>
                  <input type="number" class="form-row-input" placeholder="123" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Telefone</label>
                  <input type="tel" class="form-row-input" placeholder="(11) 99999-9999" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Data</label>
                  <input type="date" class="form-row-input" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Hora</label>
                  <input type="time" class="form-row-input" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Textarea</label>
                  <textarea class="form-row-input form-row-textarea" placeholder="Texto longo..." rows="3" />
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Select</label>
                  <select class="form-row-input">
                    <option>Opção 1</option>
                    <option>Opção 2</option>
                    <option>Opção 3</option>
                  </select>
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Checkbox</label>
                  <input type="checkbox" class="form-row-checkbox" />
                </div>
                <div class="form-divider" />
                <div class="form-row form-row-radio">
                  <label class="form-row-label">Radio</label>
                  <div class="radio-group">
                    <label class="radio-option">
                      <input type="radio" name="demo-radio" /> Opção A
                    </label>
                    <label class="radio-option">
                      <input type="radio" name="demo-radio" /> Opção B
                    </label>
                  </div>
                </div>
                <div class="form-divider" />
                <div class="form-row">
                  <label class="form-row-label">Password</label>
                  <input type="password" class="form-row-input" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Botões</h2>
          <div class="button-grid">
            <ion-button expand="block" size="default">Primário</ion-button>
            <ion-button expand="block" size="default" fill="outline">Outline</ion-button>
            <ion-button expand="block" size="default" fill="clear">Clear</ion-button>
            <ion-button expand="block" size="default" color="danger">Danger</ion-button>
            <ion-button expand="block" size="small" fill="outline">Small</ion-button>
            <ion-button expand="block" size="default" :disabled="true">Desabilitado</ion-button>
          </div>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Lista com ações</h2>
          <ion-list lines="inset">
            <ion-item-sliding v-for="item in demoItems" :key="item.id">
              <ion-item detail>
                <ion-icon slot="start" :icon="item.icon" color="primary" />
                <ion-label>
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.subtitle }}</p>
                </ion-label>
                <ion-badge slot="end" :color="item.badgeColor">{{ item.badge }}</ion-badge>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option color="danger">
                  <ion-icon slot="icon-only" :icon="trashOutline" />
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          </ion-list>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Segmentos</h2>
          <ion-segment v-model="selectedSegment">
            <ion-segment-button value="all">
              <ion-label>Todos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="active">
              <ion-label>Ativos</ion-label>
            </ion-segment-button>
            <ion-segment-button value="archived">
              <ion-label>Arquivados</ion-label>
            </ion-segment-button>
          </ion-segment>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Cards</h2>
          <ion-card>
            <ion-card-header>
              <ion-card-title>Título do card</ion-card-title>
              <ion-card-subtitle>Subtítulo</ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              Conteúdo do card com texto descritivo. Ideal para agrupar informações relacionadas.
            </ion-card-content>
          </ion-card>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Tipografia</h2>
          <div class="type-samples">
            <p class="type-2xl">Título 2XL (24px)</p>
            <p class="type-xl">Título XL (20px)</p>
            <p class="type-lg">Título LG (16px)</p>
            <p class="type-base">Texto base (14px)</p>
            <p class="type-sm">Texto SM (13px)</p>
            <p class="type-xs">Texto XS (11px)</p>
          </div>
        </section>

        <section class="showcase-section">
          <h2 class="section-title">Cores</h2>
          <div class="color-grid">
            <div class="color-swatch" style="background: var(--color-primary)">
              <span>Primary</span>
            </div>
            <div class="color-swatch" style="background: var(--color-accent)">
              <span>Accent</span>
            </div>
            <div class="color-swatch" style="background: var(--color-success)">
              <span>Success</span>
            </div>
            <div class="color-swatch" style="background: var(--color-warning)">
              <span>Warning</span>
            </div>
            <div class="color-swatch" style="background: var(--color-error)">
              <span>Error</span>
            </div>
            <div class="color-swatch" style="background: var(--color-info)">
              <span>Info</span>
            </div>
          </div>
        </section>

      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  IonPage,
  IonContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  toastController,
} from '@ionic/vue'
import {
  folderOpenOutline,
  documentTextOutline,
  cloudUploadOutline,
  shieldCheckmarkOutline,
  trashOutline,
  listOutline,
  closeOutline,
} from 'ionicons/icons'
import PageHeader from '../../../components/ui/PageHeader.vue'
import ConnectionStatus from '../../../components/feedback/ConnectionStatus.vue'
import LocalSaveStatus from '../../../components/feedback/LocalSaveStatus.vue'
import EmptyState from '../../../components/feedback/EmptyState.vue'
import ErrorState from '../../../components/feedback/ErrorState.vue'

const selectedSegment = ref('all')
const showFormComponents = ref(false)

const demoForm = reactive({
  name: '',
  email: '',
  notes: '',
})

const demoItems = [
  {
    id: '1',
    title: 'Relatório mensal',
    subtitle: 'Criado em 15/10/2026',
    icon: documentTextOutline,
    badge: 'Ativo',
    badgeColor: 'success',
  },
  {
    id: '2',
    title: 'Backup de dados',
    subtitle: 'Última sincronização: 14/10/2026',
    icon: cloudUploadOutline,
    badge: 'Pendente',
    badgeColor: 'warning',
  },
  {
    id: '3',
    title: 'Configuração de segurança',
    subtitle: 'Verificação automática ativa',
    icon: shieldCheckmarkOutline,
    badge: 'OK',
    badgeColor: 'medium',
  },
]

async function handleDemoRetry() {
  const toast = await toastController.create({
    message: 'Exemplo: tentativa de recarregamento executada.',
    duration: 2000,
    color: 'primary',
  })
  await toast.present()
}
</script>

<style scoped>
.showcase-container {
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: var(--space-8);
}

.showcase-section {
  margin-bottom: var(--space-8);
}

.section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  padding: 0 var(--space-2);
}

.card-group {
  margin-bottom: var(--space-4);
}

.group-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
  padding: 0 var(--space-2);
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.form-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-2);
}

.form-row {
  display: flex;
  align-items: flex-start;
  padding: var(--space-3) var(--space-4);
  min-height: var(--touch-target-min);
}

.form-row-label {
  flex-shrink: 0;
  width: 80px;
  font-size: var(--font-size-input);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  padding-top: 2px;
  line-height: 1.4;
}

.form-row-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-input);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  line-height: 1.4;
  padding: 0;
}

.form-row-input::placeholder {
  color: var(--color-text-muted);
}

.form-row-textarea {
  resize: none;
}

.form-divider {
  height: 1px;
  background: var(--color-border-light);
  margin-left: var(--space-4);
}

.form-caption {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  padding: 0 var(--space-4);
}

.button-grid {
  display: grid;
  gap: var(--space-2);
}

ion-item h3 {
  font-size: var(--font-size-base) !important;
  font-weight: var(--font-weight-medium) !important;
}

ion-item p {
  font-size: var(--font-size-sm) !important;
}

.type-samples {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
}

.type-2xl { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }
.type-xl { font-size: var(--font-size-xl); font-weight: var(--font-weight-semibold); }
.type-lg { font-size: var(--font-size-lg); font-weight: var(--font-weight-medium); }
.type-base { font-size: var(--font-size-base); }
.type-sm { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
.type-xs { font-size: var(--font-size-xs); color: var(--color-text-muted); }

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

.color-swatch {
  aspect-ratio: 1;
  border-radius: var(--radius-md);
  display: flex;
  align-items: flex-end;
  padding: var(--space-2);
}

.color-swatch span {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-inverse);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  overflow-y: auto;
}

.modal-content {
  width: 100%;
  max-height: 90vh;
  background: var(--color-background);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow-y: auto;
  padding: var(--space-4);
  flex-shrink: 0;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
}

.modal-header h2 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.form-row-checkbox {
  width: 20px;
  height: 20px;
  margin: 0;
}

.form-row-radio {
  align-items: flex-start;
}

.radio-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.radio-option {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.radio-option input {
  width: 20px;
  height: 20px;
  margin: 0;
}

select.form-row-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23424242' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-2) center;
  padding-right: 32px;
}
</style>
