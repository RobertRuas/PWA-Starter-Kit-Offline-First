<template>
  <div>
    <PageHeader title="PWA Starter Kit" />
    <div style="max-width: 600px; margin: 0 auto; padding: 1rem;">
      <div style="text-align: center; padding: 1.5rem 0 1rem;">
        <h1 style="margin-bottom: 0.5rem;">PWA Starter Kit</h1>
        <p style="color: var(--p-text-muted-color); margin-bottom: 0.75rem;">
          Base reutilizavel para aplicacoes mobile-first, instalaveis e com dados locais.
        </p>
        <ConnectionStatus />
      </div>

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Funcionalidades</template>
        <template #content>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div v-for="item in features" :key="item.title" style="display: flex; align-items: flex-start; gap: 0.75rem;">
              <i :class="item.icon" style="font-size: 1.4rem; color: var(--p-primary-color); margin-top: 2px;" />
              <div>
                <div style="font-weight: 500;">{{ item.title }}</div>
                <div style="color: var(--p-text-muted-color); font-size: 0.875rem;">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card style="margin-bottom: 1.5rem;">
        <template #title>Demonstracao</template>
        <template #content>
          <p style="color: var(--p-text-muted-color); margin-bottom: 1rem;">
            Esta e a aplicacao de demonstracao do Starter Kit. Explore a vitrine
            de componentes ou use a aba Registros para testar a persistencia local.
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <Button label="Vitrine de componentes" icon="pi pi-palette" @click="router.push('/showcase')" />
            <Button label="Registros de demonstracao" icon="pi pi-list" outlined @click="router.push('/records')" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import PageHeader from '../../../components/ui/PageHeader.vue'
import ConnectionStatus from '../../../components/feedback/ConnectionStatus.vue'

const router = useRouter()

const features = [
  { icon: 'pi pi-mobile', title: 'Mobile-first', description: 'Interface compacta otimizada para telas pequenas' },
  { icon: 'pi pi-cloud', title: 'Offline-first', description: 'Funciona sem internet apos o primeiro carregamento' },
  { icon: 'pi pi-database', title: 'Dados locais', description: 'IndexedDB com Dexie.js para persistencia estruturada' },
  { icon: 'pi pi-download', title: 'Exportacao e importacao', description: 'Backup e recuperacao dos dados do dispositivo' },
]
</script>
