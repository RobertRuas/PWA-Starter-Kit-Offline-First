import { BaseRepository } from '../../../core/database/repositories/base.repository';
import { db } from '../../../core/database/db';
import type { ExampleRecord } from '../types/example-record';

class ExampleRecordRepository extends BaseRepository<ExampleRecord> {
  constructor() {
    super(db.exampleRecords);
  }

  async searchByTitle(query: string): Promise<ExampleRecord[]> {
    const lowerQuery = query.toLowerCase();
    return this.table.filter((record) => record.title.toLowerCase().includes(lowerQuery)).toArray();
  }

  async getOrderedByDate(ascending: boolean = false): Promise<ExampleRecord[]> {
    const collection = this.table.orderBy('createdAt');
    return ascending ? collection.toArray() : collection.reverse().toArray();
  }
}

export const exampleRecordRepository = new ExampleRecordRepository();
