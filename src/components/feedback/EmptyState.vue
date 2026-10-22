<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3rem 1rem; text-align: center;">
    <i v-if="icon" :class="icon" style="font-size: 3rem; color: var(--p-text-muted-color); margin-bottom: 1rem;" />
    <p style="font-size: 1.1rem; color: var(--p-text-color); margin-bottom: 0.25rem;">{{ title }}</p>
    <p v-if="description" style="color: var(--p-text-muted-color); max-width: 280px;">{{ description }}</p>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  icon?: string
}>()
</script>
