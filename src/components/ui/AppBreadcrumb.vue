<template>
  <nav v-if="crumbs.length > 1" class="app-breadcrumb">
    <template v-for="(crumb, index) in crumbs" :key="crumb.path">
      <span v-if="index > 0" class="breadcrumb-separator">/</span>
      <router-link
        v-if="index < crumbs.length - 1"
        :to="crumb.path"
        class="breadcrumb-link"
      >
        {{ crumb.label }}
      </router-link>
      <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path: string
}

const route = useRoute()

const crumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched
  const items: BreadcrumbItem[] = []

  for (const record of matched) {
    if (record.meta?.breadcrumb) {
      items.push({
        label: record.meta.breadcrumb as string,
        path: record.path || '/',
      })
    }
  }

  if (route.meta?.breadcrumb && !items.find(i => i.path === route.path)) {
    items.push({
      label: route.meta.breadcrumb as string,
      path: route.path,
    })
  }

  return items
})
</script>

<style scoped>
.app-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: var(--p-text-muted-color);
  flex-wrap: wrap;
}

.breadcrumb-separator {
  color: var(--p-surface-400);
}

.breadcrumb-link {
  color: var(--p-primary-color);
  text-decoration: none;
  transition: opacity 0.15s;
}

.breadcrumb-link:hover {
  opacity: 0.7;
}

.breadcrumb-current {
  color: var(--p-text-muted-color);
}
</style>
