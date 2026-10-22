<template>
  <div class="page-header">
    <div class="page-header-top">
      <div class="page-header-left">
        <div>
          <AppBreadcrumb />
          <h1 class="page-header-title">{{ title }}</h1>
          <p v-if="subtitle" class="page-header-subtitle">{{ subtitle }}</p>
        </div>
      </div>
      <div class="page-header-actions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppBreadcrumb from './AppBreadcrumb.vue'

defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<style scoped>
.page-header {
  padding: 1.25rem 1.5rem;
}

.page-header-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.page-header-left {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  min-width: 0;
}

.page-header-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0.125rem 0 0;
  line-height: 1.3;
}

.page-header-subtitle {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
  margin: 0.125rem 0 0;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .page-header {
    padding: 1rem;
  }

  .page-header-title {
    font-size: 1.25rem;
  }
}
</style>
