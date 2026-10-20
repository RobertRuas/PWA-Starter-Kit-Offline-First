import Dexie, { type EntityTable } from 'dexie';
import type { ExampleRecord } from '../../features/example-records/types/example-record';
import type { SyncOperation } from '../sync/types';

export class AppDatabase extends Dexie {
  exampleRecords!: EntityTable<ExampleRecord, 'id'>;
  syncQueue!: EntityTable<SyncOperation, 'id'>;

  constructor() {
    super('pwa-starter-kit');
    this.version(1).stores({
      exampleRecords: 'id, title, createdAt, updatedAt',
      syncQueue: 'id, entityType, entityId, status, nextAttemptAt',
    });
  }
}

export const db = new AppDatabase();
