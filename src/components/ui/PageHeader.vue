<template>
  <Toolbar>
    <template #start>
      <Button
        v-if="showBack"
        icon="pi pi-arrow-left"
        text
        rounded
        @click="router.push(backHref)"
      />
      <span class="p-toolbar-title">{{ title }}</span>
    </template>
    <template #end>
      <slot name="actions" />
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'

const router = useRouter()

withDefaults(
  defineProps<{
    title: string
    showBack?: boolean
    backHref?: string
  }>(),
  {
    showBack: false,
    backHref: '/',
  },
)
</script>

<style scoped>
.p-toolbar-title {
  font-weight: 600;
  font-size: 1.1rem;
  margin-left: 0.5rem;
}
</style>
