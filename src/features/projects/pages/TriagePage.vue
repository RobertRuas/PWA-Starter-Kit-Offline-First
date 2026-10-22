<template>
  <div>
    <PageHeader title="Fotos por categorizar" />

    <div class="triage-content">
      <div v-if="photos.length === 0 && !loading" class="empty-state">
        <i class="pi pi-check-circle empty-icon" />
        <p>Todas as fotos foram categorizadas</p>
        <Button label="Voltar ao projeto" text @click="router.push(`/projects/${id}`)" />
      </div>

      <div v-else class="triage-grid">
        <div
          v-for="photo in photos"
          :key="photo.id"
          class="triage-thumb"
          @click="openViewer(photo.id)"
        >
          <img :src="getThumbnailUrl(photo)" :alt="photo.filename" loading="lazy" />
        </div>
      </div>

      <div v-if="photos.length > 0" class="triage-info">
        <Tag :value="`${photos.length} fotos`" severity="info" rounded />
        <span class="triage-hint">Toque em uma foto para categorizar</span>
      </div>
    </div>

    <ImageViewer
      v-model:visible="viewerVisible"
      :photos="photos"
      :initial-photo-id="viewerPhotoId"
      :project-id="id"
      :categories="categories"
      @photo-moved="reloadPhotos"
      @photo-deleted="reloadPhotos"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import PageHeader from '../../../components/ui/PageHeader.vue'
import ImageViewer from '../../../components/viewer/ImageViewer.vue'
import { projectRepository } from '../../../core/database/repositories/project.repository'
import type { Photo, PhotoCategory } from '../../../core/database/db'

const props = defineProps<{ id: string }>()
const router = useRouter()

const photos = ref<Photo[]>([])
const categories = ref<PhotoCategory[]>([])
const loading = ref(true)
const objectUrls = ref<string[]>([])
const viewerVisible = ref(false)
const viewerPhotoId = ref('')

async function loadPhotos() {
  loading.value = true
  revokeUrls()
  photos.value = await projectRepository.getInboxPhotos(props.id)
  categories.value = await projectRepository.getCategoriesForProject(props.id)
  loading.value = false
}

async function reloadPhotos() {
  revokeUrls()
  photos.value = await projectRepository.getInboxPhotos(props.id)
}

function getThumbnailUrl(photo: Photo): string {
  const url = URL.createObjectURL(photo.thumbnailBlob)
  objectUrls.value.push(url)
  return url
}

function revokeUrls() {
  objectUrls.value.forEach((url) => URL.revokeObjectURL(url))
  objectUrls.value = []
}

function openViewer(photoId: string) {
  viewerPhotoId.value = photoId
  viewerVisible.value = true
}

onMounted(loadPhotos)

onUnmounted(revokeUrls)
</script>

<style scoped>
.triage-content {
  padding: 0 1rem 2rem;
  max-width: 800px;
  margin: 0 auto;
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
  color: var(--p-green-500);
}

.triage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 4px;
}

.triage-thumb {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 4px;
  cursor: pointer;
  background: var(--p-surface-100);
}

.triage-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.triage-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.triage-hint {
  color: var(--p-text-muted-color);
  font-size: 0.8125rem;
}
</style>
