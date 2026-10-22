import type { Project } from '../database/db'
import { projectRepository } from '../database/repositories/project.repository'
import { importPhotos } from './photo-importer'

export async function importProjectFromZip(file: File): Promise<Project> {
  const { default: JSZip } = await import('jszip')
  const zip = await JSZip.loadAsync(file)

  const projectName = file.name.replace(/\.zip$/i, '') || 'Projeto importado'
  const project = await projectRepository.createProject(projectName)

  const folders = new Map<string, string>()
  const rootFiles: File[] = []

  for (const [path, entry] of Object.entries(zip.files)) {
    if (entry.dir) continue
    if (!path.match(/\.(jpe?g|png|gif|webp|bmp|tiff?)$/i)) continue

    const parts = path.split('/')
    const isInFolder = parts.length > 1
    const folderName = isInFolder ? parts[0] : null
    const fileName = parts[parts.length - 1]

    const blob = await entry.async('blob')
    const imageFile = new File([blob], fileName, { type: 'image/jpeg' })

    if (folderName && folderName !== 'Inbox') {
      let categoryId = folders.get(folderName)
      if (!categoryId) {
        const cat = await projectRepository.createCategory(project.id, folderName)
        categoryId = cat.id
        folders.set(folderName, categoryId)
      }
      await importPhotos([imageFile], project.id, categoryId)
    } else {
      rootFiles.push(imageFile)
    }
  }

  if (rootFiles.length > 0) {
    await importPhotos(rootFiles, project.id, null)
  }

  return project
}
