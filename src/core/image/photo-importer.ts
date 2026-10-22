import type { Photo } from '../database/db'
import { projectRepository } from '../database/repositories/project.repository'
import { processImage } from './image-processor'

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, '').replace(/\s+/g, '')
}

export async function importPhotos(
  files: File[],
  projectId: string,
  categoryId: string | null = null,
): Promise<Photo[]> {
  const project = await projectRepository.getProject(projectId)
  if (!project) throw new Error('Project not found')

  const projectName = sanitizeName(project.name)

  let categoryName = 'Inbox'
  if (categoryId) {
    const categories = await projectRepository.getCategoriesForProject(projectId)
    const cat = categories.find(c => c.id === categoryId)
    if (cat) categoryName = sanitizeName(cat.name)
  }

  const existingPhotos = categoryId
    ? await projectRepository.getPhotosByCategory(categoryId)
    : await projectRepository.getInboxPhotos(projectId)

  let startOrder = existingPhotos.length

  const imported: Photo[] = []

  for (const file of files) {
    const processed = await processImage(file)
    const order = startOrder++
    const filename = `${projectName}_${categoryName}_${order + 1}.jpeg`

    const photo: Photo = {
      id: projectRepository.generateId(),
      projectId,
      categoryId,
      filename,
      originalFilename: file.name,
      order,
      width: processed.width,
      height: processed.height,
      size: processed.size,
      blob: processed.blob,
      thumbnailBlob: processed.thumbnailBlob,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await projectRepository.addPhoto(photo)
    imported.push(photo)
  }

  return imported
}
