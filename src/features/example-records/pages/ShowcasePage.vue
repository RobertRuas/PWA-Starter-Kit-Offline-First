<template>
  <div>
    <PageHeader title="Vitrine" subtitle="Componentes e padroes do kit" />

    <div class="showcase-content">
      <!-- Feedback components -->
      <Card>
        <template #title>Componentes de feedback</template>
        <template #content>
          <div class="showcase-section">
            <div class="showcase-label">Status de conexao</div>
            <ConnectionStatus />
          </div>

          <div class="showcase-section">
            <div class="showcase-label">Status de salvamento local</div>
            <div class="showcase-row">
              <LocalSaveStatus status="saved" />
              <LocalSaveStatus status="saving" />
              <LocalSaveStatus status="error" />
            </div>
          </div>

          <div class="showcase-section">
            <div class="showcase-label">Estado vazio</div>
            <EmptyState
              title="Nenhum item"
              description="Exemplo de estado vazio para listas sem conteudo."
              icon="pi pi-folder-open"
            />
          </div>

          <div class="showcase-section">
            <div class="showcase-label">Estado de erro</div>
            <ErrorState
              title="Falha ao carregar"
              description="Exemplo de estado de erro com botao de nova tentativa."
              retry-label="Tentar novamente"
              @retry="handleDemoRetry"
            />
          </div>
        </template>
      </Card>

      <!-- Buttons -->
      <Card>
        <template #title>Botoes</template>
        <template #content>
          <div class="showcase-buttons">
            <div class="showcase-row">
              <Button label="Primario" />
              <Button label="Secundario" severity="secondary" />
              <Button label="Sucesso" severity="success" />
            </div>
            <div class="showcase-row">
              <Button label="Outline" outlined />
              <Button label="Text" text />
              <Button label="Danger" severity="danger" />
            </div>
            <div class="showcase-row">
              <Button label="Pequeno" size="small" />
              <Button label="Grande" size="large" />
              <Button label="Desabilitado" disabled />
            </div>
            <div class="showcase-row">
              <Button icon="pi pi-check" rounded />
              <Button icon="pi pi-bookmark" rounded outlined />
              <Button icon="pi pi-search" rounded text />
              <Button icon="pi pi-trash" rounded severity="danger" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Tags -->
      <Card>
        <template #title>Tags e badges</template>
        <template #content>
          <div class="showcase-row">
            <Tag value="Sucesso" severity="success" rounded />
            <Tag value="Info" severity="info" rounded />
            <Tag value="Aviso" severity="warn" rounded />
            <Tag value="Perigo" severity="danger" rounded />
            <Tag value="Secundario" severity="secondary" rounded />
          </div>
        </template>
      </Card>

      <!-- Messages -->
      <Card>
        <template #title>Mensagens</template>
        <template #content>
          <div class="showcase-messages">
            <Message severity="success" :closable="false">Operacao realizada com sucesso.</Message>
            <Message severity="info" :closable="false">Informacao relevante para o usuario.</Message>
            <Message severity="warn" :closable="false">Atencao: verifique os dados antes de prosseguir.</Message>
            <Message severity="error" :closable="false">Erro ao processar a solicitacao.</Message>
          </div>
        </template>
      </Card>

      <!-- Form sample -->
      <Card>
        <template #title>Formulario</template>
        <template #content>
          <div class="p-fluid showcase-form">
            <div class="form-field">
              <label for="demo-name">Nome</label>
              <InputText id="demo-name" v-model="demoForm.name" placeholder="Digite seu nome" />
            </div>
            <div class="form-field">
              <label for="demo-email">Email</label>
              <InputText id="demo-email" v-model="demoForm.email" placeholder="exemplo@email.com" />
            </div>
            <div class="form-field">
              <label for="demo-notes">Notas</label>
              <Textarea id="demo-notes" v-model="demoForm.notes" placeholder="Opcional" rows="2" />
            </div>
          </div>
          <Button
            label="Ver todos os componentes de formulario"
            icon="pi pi-list"
            outlined
            style="margin-top: 1rem; width: 100%;"
            @click="router.push('/showcase/form')"
          />
        </template>
      </Card>

      <!-- List with badges -->
      <Card>
        <template #title>Lista com badges</template>
        <template #content>
          <div class="showcase-list">
            <div v-for="item in demoItems" :key="item.id" class="showcase-list-item">
              <div class="showcase-list-icon-wrapper">
                <i :class="item.icon" class="showcase-list-icon" />
              </div>
              <div class="showcase-list-text">
                <div class="showcase-list-title">{{ item.title }}</div>
                <div class="showcase-list-subtitle">{{ item.subtitle }}</div>
              </div>
              <Tag :value="item.badge" :severity="item.badgeSeverity" rounded />
            </div>
          </div>
        </template>
      </Card>

      <!-- Segments -->
      <Card>
        <template #title>Segmentos</template>
        <template #content>
          <SelectButton
            v-model="selectedSegment"
            :options="segmentOptions"
            option-label="label"
            option-value="value"
          />
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import SelectButton from 'primevue/selectbutton'
import PageHeader from '../../../components/ui/PageHeader.vue'
import ConnectionStatus from '../../../components/feedback/ConnectionStatus.vue'
import LocalSaveStatus from '../../../components/feedback/LocalSaveStatus.vue'
import EmptyState from '../../../components/feedback/EmptyState.vue'
import ErrorState from '../../../components/feedback/ErrorState.vue'

const router = useRouter()
const toast = useToast()

const selectedSegment = ref('all')
const segmentOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Ativos', value: 'active' },
  { label: 'Arquivados', value: 'archived' },
]

const demoForm = reactive({
  name: '',
  email: '',
  notes: '',
})

const demoItems = [
  { id: '1', title: 'Relatorio mensal', subtitle: 'Criado em 15/10/2026', icon: 'pi pi-file', badge: 'Ativo', badgeSeverity: 'success' as const },
  { id: '2', title: 'Backup de dados', subtitle: 'Ultima sincronizacao: 14/10/2026', icon: 'pi pi-cloud-upload', badge: 'Pendente', badgeSeverity: 'warn' as const },
  { id: '3', title: 'Configuracao de seguranca', subtitle: 'Verificacao automatica ativa', icon: 'pi pi-shield', badge: 'OK', badgeSeverity: 'secondary' as const },
]

function handleDemoRetry() {
  toast.add({ severity: 'info', summary: 'Exemplo: tentativa de recarregamento executada.', life: 2000 })
}
</script>

<style scoped>
.showcase-content {
  padding: 0 1.5rem 2rem;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.showcase-section {
  margin-bottom: 1.5rem;
}

.showcase-section:last-child {
  margin-bottom: 0;
}

.showcase-label {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--p-text-muted-color);
}

.showcase-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.showcase-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.showcase-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.showcase-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.form-field label {
  font-weight: 600;
  font-size: 0.875rem;
}

.showcase-list {
  display: flex;
  flex-direction: column;
}

.showcase-list-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--p-surface-200);
}

.showcase-list-item:last-child {
  border-bottom: none;
}

.showcase-list-icon-wrapper {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: var(--p-border-radius);
  background: var(--p-primary-50);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.showcase-list-icon {
  font-size: 1rem;
  color: var(--p-primary-color);
}

.showcase-list-text {
  flex: 1;
  min-width: 0;
}

.showcase-list-title {
  font-weight: 600;
}

.showcase-list-subtitle {
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .showcase-content {
    padding: 0 1rem 2rem;
  }
}
</style>
