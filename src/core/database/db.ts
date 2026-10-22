import Dexie from 'dexie'
import type { Table } from 'dexie'

export interface ExampleRecord {
  id?: string
  title: string
  description: string
  status: 'active' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface SyncQueueItem {
  id?: number
  entityType: string
  entityId: string
  operation: 'create' | 'update' | 'delete'
  payload: string
  createdAt: string
  attemptCount: number
  nextAttemptAt: string | null
  status: 'pending' | 'sending' | 'completed' | 'failed'
  lastError: string | null
}

export interface Project {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface PhotoCategory {
  id: string
  projectId: string
  name: string
  order: number
}

export interface Photo {
  id: string
  projectId: string
  categoryId: string | null
  filename: string
  originalFilename: string
  order: number
  width: number
  height: number
  size: number
  blob: Blob
  thumbnailBlob: Blob
  createdAt: string
  updatedAt: string
}

export class AppDatabase extends Dexie {
  exampleRecords!: Table<ExampleRecord, string>
  syncQueue!: Table<SyncQueueItem, number>
  projects!: Table<Project, string>
  photoCategories!: Table<PhotoCategory, string>
  photos!: Table<Photo, string>

  constructor() {
    super('pwa-starter-kit')
    this.version(1).stores({
      exampleRecords: 'id, status, createdAt, updatedAt',
      syncQueue: '++id, entityType, entityId, status, nextAttemptAt',
    })
    this.version(2).stores({
      exampleRecords: 'id, status, createdAt, updatedAt',
      syncQueue: '++id, entityType, entityId, status, nextAttemptAt',
      projects: 'id, name, createdAt',
      photoCategories: 'id, projectId, name, order',
      photos: 'id, projectId, categoryId, order, filename, createdAt',
    })
  }
}

export const db = new AppDatabase()
