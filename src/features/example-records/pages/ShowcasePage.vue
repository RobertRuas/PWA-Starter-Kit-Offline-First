<template>
  <div>
    <PageHeader title="Demonstracao" show-back back-href="/home" />
    <div style="max-width: 600px; margin: 0 auto; padding: 1rem 1rem 2rem;">

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Componentes de feedback</template>
        <template #content>
          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 500; margin-bottom: 0.5rem;">Status de conexao</div>
            <ConnectionStatus />
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 500; margin-bottom: 0.5rem;">Status de salvamento local</div>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              <LocalSaveStatus status="saved" />
              <LocalSaveStatus status="saving" />
              <LocalSaveStatus status="error" />
            </div>
          </div>

          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 500; margin-bottom: 0.5rem;">Estado vazio</div>
            <EmptyState
              title="Nenhum item"
              description="Exemplo de estado vazio para listas sem conteudo."
              icon="pi pi-folder-open"
            />
          </div>

          <div>
            <div style="font-weight: 500; margin-bottom: 0.5rem;">Estado de erro</div>
            <ErrorState
              title="Falha ao carregar"
              description="Exemplo de estado de erro com botao de nova tentativa."
              retry-label="Tentar novamente"
              @retry="handleDemoRetry"
            />
          </div>
        </template>
      </Card>

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Formulario PrimeVue</template>
        <template #content>
          <div class="p-fluid" style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label for="demo-name">Nome</label>
              <InputText id="demo-name" v-model="demoForm.name" placeholder="Digite seu nome" />
            </div>
            <div>
              <label for="demo-email">Email</label>
              <InputText id="demo-email" v-model="demoForm.email" placeholder="exemplo@email.com" />
            </div>
            <div>
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

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Botoes</template>
        <template #content>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <Button label="Primario" />
            <Button label="Outline" outlined />
            <Button label="Text" text />
            <Button label="Danger" severity="danger" />
            <Button label="Small" size="small" outlined />
            <Button label="Desabilitado" disabled />
          </div>
        </template>
      </Card>

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Lista com badges</template>
        <template #content>
          <div v-for="item in demoItems" :key="item.id" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 0; border-bottom: 1px solid var(--p-content-border-color);">
            <i :class="item.icon" style="font-size: 1.25rem; color: var(--p-primary-color);" />
            <div style="flex: 1;">
              <div style="font-weight: 500;">{{ item.title }}</div>
              <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ item.subtitle }}</div>
            </div>
            <Tag :value="item.badge" :severity="item.badgeSeverity" />
          </div>
        </template>
      </Card>

      <Card style="margin-bottom: 1.5rem;">
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

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Card PrimeVue</template>
        <template #subtitle>Subtitulo</template>
        <template #content>
          Conteudo do card com texto descritivo. Ideal para agrupar informacoes relacionadas.
        </template>
      </Card>

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Paginas de exemplo</template>
        <template #content>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <Button label="Tabela de dados" outlined @click="router.push('/examples/data-table')" />
            <Button label="Galeria de imagens" outlined @click="router.push('/examples/image-gallery')" />
            <Button label="Galeria de loja" outlined @click="router.push('/examples/store-gallery')" />
            <Button label="Detalhe de item" outlined @click="router.push('/examples/item-detail')" />
            <Button label="Login" outlined @click="router.push('/examples/login')" />
            <Button label="Cadastro" outlined @click="router.push('/examples/signup')" />
          </div>
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
