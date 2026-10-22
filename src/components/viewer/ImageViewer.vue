<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="image-viewer"
      @touchstart.passive="onTouchStart"
      @touchmove.passive="onTouchMove"
      @touchend="onTouchEnd"
      @keydown="onKeyDown"
      tabindex="0"
      ref="viewerEl"
    >
      <div class="viewer-image-area">
        <img
          v-if="currentImageUrl"
          :src="currentImageUrl"
          :key="imageKey"
          class="viewer-image"
          :style="swipeStyle"
        />
      </div>

      <div class="viewer-controls">
        <div class="viewer-nav">
          <button class="nav-btn" :disabled="currentIndex <= 0" @click="prev">
            <i class="pi pi-chevron-left" />
          </button>
          <span class="nav-counter">{{ photos.length > 0 ? `${currentIndex + 1} / ${photos.length}` : '0 / 0' }}</span>
          <button class="nav-btn" :disabled="currentIndex >= photos.length - 1" @click="next">
            <i class="pi pi-chevron-right" />
          </button>
        </div>

        <div class="viewer-keyboard">
          <button class="kb-btn kb-btn-general" @click="moveToInbox">
            <span class="kb-num">0</span>
            <span class="kb-label">Geral</span>
          </button>
          <button
            v-for="(cat, idx) in categories.slice(0, 9)"
            :key="cat.id"
            class="kb-btn"
            :class="{ 'kb-btn-active': currentPhoto?.categoryId === cat.id }"
            @click="moveToCategory(cat.id)"
          >
            <span class="kb-num">{{ idx + 1 }}</span>
            <span class="kb-label">{{ cat.name }}</span>
          </button>
          <button class="kb-btn kb-btn-delete" @click="handleDelete">
            <i class="pi pi-trash" />
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import type { Photo, PhotoCategory } from '../../core/database/db'
import { projectRepository } from '../../core/database/repositories/project.repository'

const props = defineProps<{
  visible: boolean
  photos: Photo[]
  initialPhotoId: string
  projectId: string
  categories: PhotoCategory[]
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'photo-moved': []
  'photo-deleted': []
}>()

const viewerEl = ref<HTMLDivElement>()
const currentIndex = ref(0)
const currentImageUrl = ref<string | null>(null)
const imageKey = ref(0)

let touchStartY = 0
let touchDeltaY = 0
const swipeOffset = ref(0)

const swipeStyle = computed(() => {
  if (swipeOffset.value === 0) return {}
  return {
    transform: `translateY(${swipeOffset.value}px)`,
    opacity: `${Math.max(0.2, 1 - Math.abs(swipeOffset.value) / 300)}`,
  }
})

const currentPhoto = computed(() => props.photos[currentIndex.value] ?? null)

function loadImage() {
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value)
    currentImageUrl.value = null
  }
  const photo = currentPhoto.value
  if (photo) {
    currentImageUrl.value = URL.createObjectURL(photo.blob)
    imageKey.value++
  }
}

watch(
  () => props.visible,
  (val) => {
    if (val) {
      const idx = props.photos.findIndex((p) => p.id === props.initialPhotoId)
      currentIndex.value = idx >= 0 ? idx : 0
      loadImage()
      nextTick(() => viewerEl.value?.focus())
    } else {
      if (currentImageUrl.value) {
        URL.revokeObjectURL(currentImageUrl.value)
        currentImageUrl.value = null
      }
    }
  },
)

watch(currentIndex, () => loadImage())

function close() {
  emit('update:visible', false)
}

function prev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

function next() {
  if (currentIndex.value < props.photos.length - 1) {
    currentIndex.value++
  }
}

function advanceAfterAction() {
  if (props.photos.length === 0) {
    close()
    return
  }
  if (currentIndex.value >= props.photos.length) {
    currentIndex.value = Math.max(0, props.photos.length - 1)
  }
  loadImage()
}

async function moveToCategory(categoryId: string) {
  const photo = currentPhoto.value
  if (!photo) return
  const targetPhotos = await projectRepository.getPhotosByCategory(categoryId)
  const newOrder = targetPhotos.length
  await projectRepository.movePhoto(photo.id, categoryId, newOrder)
  emit('photo-moved')
  nextTick(() => advanceAfterAction())
}

async function moveToInbox() {
  const photo = currentPhoto.value
  if (!photo) return
  const inboxPhotos = await projectRepository.getInboxPhotos(props.projectId)
  const newOrder = inboxPhotos.length
  await projectRepository.movePhoto(photo.id, null, newOrder)
  emit('photo-moved')
  nextTick(() => advanceAfterAction())
}

async function handleDelete() {
  const photo = currentPhoto.value
  if (!photo) return
  await projectRepository.deletePhoto(photo.id)
  emit('photo-deleted')
  nextTick(() => advanceAfterAction())
}

function onKeyDown(e: KeyboardEvent) {
  const key = e.key
  if (key === 'Escape') {
    close()
    return
  }
  if (key === 'ArrowLeft') {
    prev()
    return
  }
  if (key === 'ArrowRight') {
    next()
    return
  }
  if (key === '0') {
    moveToInbox()
    return
  }
  if (key >= '1' && key <= '9') {
    const idx = parseInt(key) - 1
    if (idx < props.categories.length) {
      moveToCategory(props.categories[idx].id)
    }
    return
  }
  if (key === 'Delete' || key === 'Backspace') {
    e.preventDefault()
    handleDelete()
  }
}

function onTouchStart(e: TouchEvent) {
  touchStartY = e.touches[0].clientY
  touchDeltaY = 0
  swipeOffset.value = 0
}

function onTouchMove(e: TouchEvent) {
  touchDeltaY = e.touches[0].clientY - touchStartY
  if (touchDeltaY > 0) {
    swipeOffset.value = touchDeltaY
  }
}

function onTouchEnd() {
  if (touchDeltaY > 100) {
    close()
  }
  swipeOffset.value = 0
  touchDeltaY = 0
}

onUnmounted(() => {
  if (currentImageUrl.value) {
    URL.revokeObjectURL(currentImageUrl.value)
  }
})
</script>

<style scoped>
.image-viewer {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #fff;
  display: flex;
  flex-direction: column;
  outline: none;
}

.viewer-image-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 8px;
  min-height: 0;
}

.viewer-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: opacity 0.15s;
  user-select: none;
  -webkit-user-drag: none;
}

.viewer-controls {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 8px 12px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  flex-shrink: 0;
}

.viewer-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 8px;
}

.nav-btn {
  background: none;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  color: var(--p-text-color, #333);
  font-size: 1rem;
  border-radius: 6px;
  transition: background 0.15s;
}

.nav-btn:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.nav-counter {
  font-size: 0.75rem;
  color: var(--p-text-muted-color, #888);
  min-width: 60px;
  text-align: center;
}

.viewer-keyboard {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.kb-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  height: 48px;
  border: 1px solid var(--p-surface-300, #ccc);
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  padding: 2px 6px;
  flex: 1;
  max-width: 80px;
  font-size: 0.7rem;
  transition: background 0.15s;
  color: var(--p-text-color, #333);
  font-family: inherit;
}

.kb-btn:active {
  background: var(--p-primary-50, #e8f0fe);
}

.kb-btn-active {
  border-color: var(--p-primary-color, #24527A);
  background: var(--p-primary-50, #e8f0fe);
}

.kb-btn-general {
  flex: 1.4;
  max-width: 100px;
  background: var(--p-surface-50, #f8f9fa);
  font-weight: 600;
}

.kb-btn-general:active {
  background: var(--p-primary-50, #e8f0fe);
}

.kb-btn-delete {
  flex: 1.4;
  max-width: 100px;
  color: var(--p-red-500, #ef4444);
  border-color: var(--p-red-200, #fecaca);
}

.kb-btn-delete:active {
  background: var(--p-red-50, #fef2f2);
}

.kb-num {
  font-weight: 700;
  font-size: 0.85rem;
  line-height: 1;
}

.kb-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  line-height: 1.2;
}
</style>
