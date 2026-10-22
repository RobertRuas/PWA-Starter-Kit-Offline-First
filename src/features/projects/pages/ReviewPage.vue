<template>
  <div>
    <PageHeader title="Revisão" />

    <div class="review-content">
      <!-- Toolbar -->
      <div class="review-toolbar">
        <div class="toolbar-left">
          <button
            class="tool-btn"
            :class="{ active: selectionMode }"
            title="Selecionar"
            @click="toggleSelection"
          >
            <i class="pi pi-check-square" />
          </button>
          <button
            v-if="selectionMode && selectedIds.size > 0"
            class="tool-btn danger"
            title="Excluir selecionadas"
            @click="deleteSelected"
          >
            <i class="pi pi-trash" />
          </button>
          <button
            v-if="selectionMode && selectedIds.size > 0"
            class="tool-btn"
            title="Remover categoria"
            @click="uncategorizeSelected"
          >
            <i class="pi pi-inbox" />
          </button>
        </div>
        <div class="toolbar-right">
          <button class="tool-btn" title="Diminuir" @click="zoomOut">
            <i class="pi pi-minus" />
          </button>
          <button class="tool-btn" title="Auto" @click="zoomAuto">
            <i class="pi pi-arrows-h" />
          </button>
          <button class="tool-btn" title="Aumentar" @click="zoomIn">
            <i class="pi pi-plus" />
          </button>
        </div>
      </div>

      <div v-if="categories.length === 0 && !loading" class="empty-state">
        <i class="pi pi-folder-open empty-icon" />
        <p>Nenhuma categoria criada</p>
        <Button label="Criar categoria" icon="pi pi-plus" @click="showNewCategory = true" />
      </div>

      <div v-else class="categories-list" :class="{ 'auto-zoom': autoZoom }">
        <div v-for="cat in categories" :key="cat.id" class="category-section">
          <div class="category-header">
            <span class="category-name">{{ cat.name }}</span>
            <Tag :value="`${categoryPhotos[cat.id]?.length ?? 0}`" rounded severity="secondary" />
          </div>
          <div
            class="category-grid"
            :style="gridStyle"
          >
            <div
              v-for="photo in (categoryPhotos[cat.id] ?? [])"
              :key="photo.id"
              class="review-thumb"
              :class="{ selected: selectedIds.has(photo.id) }"
              @click="handlePhotoClick(photo, cat.id)"
            >
              <img :src="getThumbnailUrl(photo)" :alt="photo.filename" loading="lazy" />
              <div v-if="selectionMode" class="thumb-check">
                <i :class="selectedIds.has(photo.id) ? 'pi pi-check-circle' : 'pi pi-circle'" />
              </div>
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

    <ImageViewer
      v-model:visible="viewerVisible"
      :photos="viewerPhotos"
      :initial-photo-id="viewerPhotoId"
      :project-id="id"
      :categories="categories"
      @photo-moved="loadData"
      @photo-deleted="loadData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import PageHeader from '../../../components/ui/PageHeader.vue'
import ImageViewer from '../../../components/viewer/ImageViewer.vue'
import { projectRepository } from '../../../core/database/repositories/project.repository'
import { useErrorToast } from '../../../composables/useErrorToast'
import type { Photo, PhotoCategory } from '../../../core/database/db'

const props = defineProps<{ id: string }>()
const { showSuccess } = useErrorToast()

const categories = ref<PhotoCategory[]>([])
const categoryPhotos = ref<Record<string, Photo[]>>({})
const loading = ref(true)
const showNewCategory = ref(false)
const newCategoryName = ref('')
const objectUrls = ref<string[]>([])

const selectionMode = ref(false)
const selectedIds = ref<Set<string>>(new Set())

const thumbSize = ref(90)
const autoZoom = ref(false)

const viewerVisible = ref(false)
const viewerPhotoId = ref('')
const viewerCategoryId = ref('')

const viewerPhotos = computed(() => {
  return categoryPhotos.value[viewerCategoryId.value] ?? []
})

const gridStyle = computed(() => {
  if (autoZoom.value) return {}
  return {
    gridTemplateColumns: `repeat(auto-fill, minmax(${thumbSize.value}px, 1fr))`,
  }
})

function zoomIn() {
  autoZoom.value = false
  thumbSize.value = Math.min(200, thumbSize.value + 20)
}

function zoomOut() {
  autoZoom.value = false
  thumbSize.value = Math.max(50, thumbSize.value - 20)
}

function zoomAuto() {
  autoZoom.value = !autoZoom.value
}

function toggleSelection() {
  selectionMode.value = !selectionMode.value
  if (!selectionMode.value) {
    selectedIds.value = new Set()
  }
}

async function deleteSelected() {
  const ids = Array.from(selectedIds.value)
  if (ids.length === 0) return
  await projectRepository.deletePhotos(ids)
  selectedIds.value = new Set()
  showSuccess(`${ids.length} fotos excluidas.`)
  await loadData()
}

async function uncategorizeSelected() {
  const ids = Array.from(selectedIds.value)
  if (ids.length === 0) return
  for (const id of ids) {
    const inboxPhotos = await projectRepository.getInboxPhotos(props.id)
    await projectRepository.movePhoto(id, null, inboxPhotos.length)
  }
  selectedIds.value = new Set()
  showSuccess(`${ids.length} fotos movidas para inbox.`)
  await loadData()
}

function handlePhotoClick(photo: Photo, categoryId: string) {
  if (selectionMode.value) {
    const next = new Set(selectedIds.value)
    if (next.has(photo.id)) {
      next.delete(photo.id)
    } else {
      next.add(photo.id)
    }
    selectedIds.value = next
  } else {
    viewerCategoryId.value = categoryId
    viewerPhotoId.value = photo.id
    viewerVisible.value = true
  }
}

function revokeUrls() {
  objectUrls.value.forEach((url) => URL.revokeObjectURL(url))
  objectUrls.value = []
}

async function loadData() {
  loading.value = true
  revokeUrls()
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

onUnmounted(revokeUrls)
</script>

<style scoped>
.review-content {
  padding: 0 1rem 2rem;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  min-height: calc(100vh - 56px - 80px);
}

.review-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--p-surface-200);
  position: sticky;
  top: 56px;
  background: var(--p-surface-ground);
  z-index: 10;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  color: var(--p-text-color);
  font-size: 0.9rem;
  transition: background 0.15s;
}

.tool-btn:hover {
  background: var(--p-surface-100);
}

.tool-btn.active {
  background: var(--p-primary-50);
  color: var(--p-primary-color);
}

.tool-btn.danger {
  color: var(--p-red-500);
}

.tool-btn.danger:hover {
  background: var(--p-red-50);
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

.auto-zoom .category-grid {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  gap: 4px;
  -webkit-overflow-scrolling: touch;
}

.auto-zoom .review-thumb {
  width: 90px;
  min-width: 90px;
  aspect-ratio: 1;
}

.review-thumb {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  background: var(--p-surface-100);
  position: relative;
}

.review-thumb.selected {
  outline: 3px solid var(--p-primary-color);
  outline-offset: -3px;
}

.review-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-check {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 1.1rem;
  color: var(--p-primary-color);
  text-shadow: 0 1px 3px rgba(255, 255, 255, 0.8);
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

@media (min-width: 992px) {
  .review-toolbar {
    top: 0;
  }
}
</style>
