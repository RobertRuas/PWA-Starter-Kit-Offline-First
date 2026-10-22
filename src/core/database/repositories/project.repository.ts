import { db, type Project, type Photo, type PhotoCategory } from '../db'

function generateId(): string {
  return crypto.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)
}

async function createProject(name: string): Promise<Project> {
  const now = new Date().toISOString()
  const project: Project = {
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now,
  }
  await db.projects.add(project)
  return project
}

async function getAllProjects(): Promise<Project[]> {
  return db.projects.orderBy('createdAt').reverse().toArray()
}

async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id)
}

async function updateProject(id: string, updates: Partial<Pick<Project, 'name'>>): Promise<void> {
  await db.projects.update(id, { ...updates, updatedAt: new Date().toISOString() })
}

async function deleteProject(id: string): Promise<void> {
  await db.transaction('rw', [db.projects, db.photos, db.photoCategories], async () => {
    await db.photos.where('projectId').equals(id).delete()
    await db.photoCategories.where('projectId').equals(id).delete()
    await db.projects.delete(id)
  })
}

async function createCategory(projectId: string, name: string): Promise<PhotoCategory> {
  const existing = await db.photoCategories.where('projectId').equals(projectId).toArray()
  const maxOrder = existing.reduce((max, c) => Math.max(max, c.order), 0)
  const category: PhotoCategory = {
    id: generateId(),
    projectId,
    name,
    order: maxOrder + 1,
  }
  await db.photoCategories.add(category)
  return category
}

async function getCategoriesForProject(projectId: string): Promise<PhotoCategory[]> {
  return db.photoCategories.where('projectId').equals(projectId).sortBy('order')
}

async function deleteCategory(id: string): Promise<void> {
  await db.transaction('rw', [db.photoCategories, db.photos], async () => {
    await db.photos.where('categoryId').equals(id).modify({ categoryId: null })
    await db.photoCategories.delete(id)
  })
}

async function getPhotosForProject(projectId: string): Promise<Photo[]> {
  return db.photos.where('projectId').equals(projectId).sortBy('order')
}

async function getInboxPhotos(projectId: string): Promise<Photo[]> {
  const all = await db.photos.where('projectId').equals(projectId).toArray()
  return all.filter(p => !p.categoryId).sort((a, b) => a.order - b.order)
}

async function getPhotosByCategory(categoryId: string): Promise<Photo[]> {
  return db.photos.where('categoryId').equals(categoryId).sortBy('order')
}

async function getPhotoCountForProject(projectId: string): Promise<number> {
  return db.photos.where('projectId').equals(projectId).count()
}

async function getInboxCount(projectId: string): Promise<number> {
  const all = await db.photos.where('projectId').equals(projectId).toArray()
  return all.filter(p => !p.categoryId).length
}

async function getCategorizedCount(projectId: string): Promise<number> {
  const all = await db.photos.where('projectId').equals(projectId).toArray()
  return all.filter(p => !!p.categoryId).length
}

async function movePhoto(photoId: string, targetCategoryId: string | null, newOrder: number): Promise<void> {
  const now = new Date().toISOString()
  const photo = await db.photos.get(photoId)
  if (!photo) return

  const project = await db.projects.get(photo.projectId)
  const projectName = project ? project.name.replace(/\s+/g, '') : 'Project'

  let categoryName = 'Inbox'
  if (targetCategoryId) {
    const cat = await db.photoCategories.get(targetCategoryId)
    if (cat) categoryName = cat.name.replace(/\s+/g, '')
  }

  const filename = `${projectName}_${categoryName}_${newOrder + 1}.jpeg`

  await db.photos.update(photoId, {
    categoryId: targetCategoryId,
    order: newOrder,
    filename,
    updatedAt: now,
  })
}

async function deletePhoto(id: string): Promise<void> {
  await db.photos.delete(id)
}

async function deletePhotos(ids: string[]): Promise<void> {
  await db.transaction('rw', db.photos, async () => {
    for (const id of ids) {
      await db.photos.delete(id)
    }
  })
}

async function addPhoto(photo: Photo): Promise<void> {
  await db.photos.add(photo)
}

async function getPhoto(id: string): Promise<Photo | undefined> {
  return db.photos.get(id)
}

export const projectRepository = {
  generateId,
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  createCategory,
  getCategoriesForProject,
  deleteCategory,
  getPhotosForProject,
  getInboxPhotos,
  getPhotosByCategory,
  getPhotoCountForProject,
  getInboxCount,
  getCategorizedCount,
  movePhoto,
  deletePhoto,
  deletePhotos,
  addPhoto,
  getPhoto,
}
