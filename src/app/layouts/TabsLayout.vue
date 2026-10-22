<template>
  <div class="app-layout">
    <div class="app-content">
      <router-view />
    </div>
    <div class="app-tabbar">
      <button
        v-for="tab in tabs"
        :key="tab.route"
        class="app-tabbar-item"
        :class="{ active: isActive(tab.route) }"
        @click="router.push(tab.route)"
      >
        <i :class="tab.icon" style="font-size: 1.25rem;" />
        <span style="font-size: 0.7rem;">{{ tab.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { label: 'Inicio', icon: 'pi pi-home', route: '/home' },
  { label: 'Registros', icon: 'pi pi-list', route: '/records' },
  { label: 'Ajustes', icon: 'pi pi-cog', route: '/settings' },
]

function isActive(path: string): boolean {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.app-content {
  flex: 1;
  overflow-y: auto;
}

.app-tabbar {
  display: flex;
  position: sticky;
  bottom: 0;
  background: var(--p-content-background);
  border-top: 1px solid var(--p-content-border-color);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.app-tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 0.5rem 0;
  background: none;
  border: none;
  color: var(--p-text-muted-color);
  cursor: pointer;
}

.app-tabbar-item.active {
  color: var(--p-primary-color);
}
</style>
