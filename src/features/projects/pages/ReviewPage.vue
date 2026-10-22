<template>
  <div>
    <PageHeader title="Revisão" />

    <div class="review-content">
      <div v-if="categories.length === 0 && !loading" class="empty-state">
        <i class="pi pi-folder-open empty-icon" />
        <p>Nenhuma categoria criada</p>
        <Button label="Criar categoria" icon="pi pi-plus" @click="showNewCategory = true" />
      </div>

      <div v-else class="categories-list">
        <div v-for="cat in categories" :key="cat.id" class="category-section">
          <div class="category-header">
            <span class="category-name">{{ cat.name }}</span>
            <Tag :value="`${categoryPhotos[cat.id]?.length ?? 0}`" rounded severity="secondary" />
          </div>
          <div class="category-grid">
            <div
              v-for="photo in (categoryPhotos[cat.id] ?? [])"
              :key="photo.id"
              class="review-thumb"
            >
              <img :src="getThumbnailUrl(photo)" :alt="photo.filename" loading="lazy" />
            </div>
            <div v-if="!categoryPhotos[cat.id]?.length" class="empty-category">
              Sem fotos
            </div>
          </div>
        </div>
      </div>

      <Button
        icon="pi pi-plus"
        rounded
        class="fab-btn"
        @click="showNewCategory = true"
      />
    </div>

    <Dialog
      v-model:visible="showNewCategory"
      header="Nova categoria"
      :modal="true"
      :style="{ width: '320px' }"
    >
      <div class="new-cat-form">
        <label for="cat-name">Nome</label>
        <InputText
          id="cat-name"
          v-model="newCategoryName"
          placeholder="Ex: Telhado"
          class="w-full"
          @keyup.enter="handleCreateCategory"
        />
      </div>
      <template #footer>
        <Button label="Cancelar" text @click="showNewCategory = false" />
        <Button label="Criar" :disabled="!newCategoryName.trim()" @click="handleCreateCategory" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import PageHeader from '../../../components/ui/PageHeader.vue'
import { projectRepository } from '../../../core/database/repositories/project.repository'
import type { Photo, PhotoCategory } from '../../../core/database/db'

const props = defineProps<{ id: string }>()

const categories = ref<PhotoCategory[]>([])
const categoryPhotos = ref<Record<string, Photo[]>>({})
const loading = ref(true)
const showNewCategory = ref(false)
const newCategoryName = ref('')
const objectUrls = ref<string[]>([])

async function loadData() {
  loading.value = true
  categories.value = await projectRepository.getCategoriesForProject(props.id)
  const photos: Record<string, Photo[]> = {}
  for (const cat of categories.value) {
    photos[cat.id] = await projectRepository.getPhotosByCategory(cat.id)
  }
  categoryPhotos.value = photos
  loading.value = false
}

function getThumbnailUrl(photo: Photo): string {
  const url = URL.createObjectURL(photo.thumbnailBlob)
  objectUrls.value.push(url)
  return url
}

async function handleCreateCategory() {
  const name = newCategoryName.value.trim()
  if (!name) return
  await projectRepository.createCategory(props.id, name)
  showNewCategory.value = false
  newCategoryName.value = ''
  await loadData()
}

onMounted(loadData)

onUnmounted(() => {
  objectUrls.value.forEach(url => URL.revokeObjectURL(url))
})
</script>

<style scoped>
.review-content {
  padding: 0 1rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  min-height: calc(100vh - 56px - 80px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--p-text-muted-color);
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.4;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: 600;
  font-size: 0.9375rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 4px;
}

.review-thumb {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  background: var(--p-surface-100);
}

.review-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.empty-category {
  grid-column: 1 / -1;
  padding: 1rem;
  text-align: center;
  color: var(--p-text-muted-color);
  font-size: 0.8125rem;
  background: var(--p-surface-50);
  border-radius: var(--p-border-radius);
}

.fab-btn {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  z-index: 50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.new-cat-form {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.new-cat-form label {
  font-weight: 600;
  font-size: 0.875rem;
}

.w-full {
  width: 100%;
}
</style>
